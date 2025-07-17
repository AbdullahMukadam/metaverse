"use client";
import { Character } from '@/app/game/clases/Character';
import { Collision } from '@/app/game/clases/Collision';
import { ForegroundObjects } from '@/app/game/clases/ForegroundObjects';
import { GameMap } from '@/app/game/clases/GameMap';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { mapDismantleState } from '@/lib/map/mapSlice';
import { exportArray } from '@/utils/collisionsData';
import {
  getSocket,
  handleSpaceCreation,
  handleUserEnteredRoom,
  handleUserLeave,
  LeftUserData,
  RemoteUserData,
  sendHouseMovementUpdate,
  sendMovementUpdate,
  setupSocketListeners,
  UsersData
} from '@/utils/Socket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import Voicechat from '../VoiceChat/Voicechat';
import { exportRoomEnterArray } from '@/utils/roomEnterData';
import { roomEnterDetect } from '@/app/game/clases/roomEnterDetect';
import { RoomMap } from '@/app/game/clases/RoomMap';
import { ExportroomCollisionArray } from '@/utils/RoomCollisionsData';
import { RoomForeground } from '@/app/game/clases/RoomForeground';
import { ExportroomOutDataArray } from '@/utils/roomOutData';
import { roomLeaveDetect } from '@/app/game/clases/roomLeaveDetect';

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap>(null);
  const characterRef = useRef<Character>(null);
  const inputHandlerRef = useRef<InputHandler>(null);
  const collisionRef = useRef<Collision>(null);
  const foregroundRef = useRef<ForegroundObjects>(null);
  const remoteUsersRef = useRef<Record<string, RemoteUser>>({});
  const remoteUsersHouseRef = useRef<Record<string, RemoteUser>>({})
  const animationFrameRef = useRef<number>(0);
  const socketRef = useRef<Socket>(null);
  const lastNetworkUpdate = useRef<number>(0);
  const roomEnterDetectRef = useRef<roomEnterDetect>(null);
  const RoomMapRef = useRef<RoomMap>(null);
  const RoomCollisionsRef = useRef<Collision>(null);
  const roomForeGroundRef = useRef<RoomForeground>(null);
  const roomLeaveDetectRef = useRef<roomLeaveDetect>(null);

  const selectedCharacter = useAppSelector((state) => state.map.character);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const collisionArrayData = exportArray;
  const roomEnterArrayData = exportRoomEnterArray;
  const roomCollisionsDataArray = ExportroomCollisionArray;
  const roomLeaveArrayData = ExportroomOutDataArray

  const [isOpen, setisOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    initializing: true,
    connectingSocket: false,
    loadingAssets: false,
    ready: false
  });
  const [isTransitionShowed, setisTransitionShowed] = useState(false);
  const [isInRoom, setisInRoom] = useState(false);
  const [currentMap, setcurrentMap] = useState("Default")

  const updateLoadingState = (updates: Partial<typeof loadingStates>) => {
    setLoadingStates(prev => ({ ...prev, ...updates }));
  };

  const initializeRoomCollisions = () => {
    if (RoomMapRef.current) {
      const tileValue = 555;
      RoomCollisionsRef.current = new Collision(roomCollisionsDataArray, tileValue, RoomMapRef.current);
      RoomCollisionsRef.current.tileHeight = 16;
      RoomCollisionsRef.current.tileWidth = 16;


    }
  };

  const startRoomGameLoop = () => {
    const RoomgameLoop = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      if (!ctx || !characterRef.current || !inputHandlerRef.current ||
        !RoomMapRef.current || !RoomCollisionsRef.current || !roomForeGroundRef.current || !roomLeaveDetectRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      
      const prevX = characterRef.current.worldX;
      const prevY = characterRef.current.worldY;

      
      characterRef.current.update(inputHandlerRef.current.keys);

      
      if (RoomCollisionsRef.current.detectCollision(characterRef.current)) {
        characterRef.current.worldX = prevX;
        characterRef.current.worldY = prevY;
      }

      if (roomLeaveDetectRef.current.detectRoomLeaveZone(characterRef.current)) {
        console.log("leaved")
      }

      const movementData = {
        positions: {
          X: characterRef.current.worldX,
          Y: characterRef.current.worldY
        },
        direction: characterRef.current.direction,
        isMoving: characterRef.current.isMoving
      };

      if (Date.now() - lastNetworkUpdate.current > 100) {
        sendHouseMovementUpdate(movementData);
        lastNetworkUpdate.current = Date.now();
      }

      
      RoomMapRef.current.draw(ctx);
      RoomCollisionsRef.current.draw(ctx);
      roomLeaveDetectRef.current.draw(ctx)
      characterRef.current.draw(ctx);

      Object.values(remoteUsersHouseRef.current).forEach(user => {
        user.draw(ctx);
      });

      roomForeGroundRef.current?.draw(ctx)

      animationFrameRef.current = requestAnimationFrame(RoomgameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(RoomgameLoop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("GamePage mounted, canvasRef.current:", canvasRef.current);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateLoadingState({
      initializing: true,
      connectingSocket: false,
      loadingAssets: false,
      ready: false
    });

    const viewPort = { width: 1280, height: 720 };
    canvas.width = viewPort.width;
    canvas.height = viewPort.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Initializing Game...', canvas.width / 2, canvas.height / 2);

    
    gameMapRef.current = null;
    characterRef.current = null;
    inputHandlerRef.current = null;
    collisionRef.current = null;
    roomEnterDetectRef.current = null
    foregroundRef.current = null;
    remoteUsersRef.current = {};
    RoomCollisionsRef.current = null;
    roomForeGroundRef.current = null;
    roomLeaveDetectRef.current = null;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    const tileValue = 1025;

    
    gameMapRef.current = new GameMap(canvas, viewPort);
    collisionRef.current = new Collision(collisionArrayData, tileValue);
    roomEnterDetectRef.current = new roomEnterDetect(roomEnterArrayData);
    roomLeaveDetectRef.current = new roomLeaveDetect(roomLeaveArrayData)
    RoomMapRef.current = new RoomMap(viewPort, canvas);
    foregroundRef.current = new ForegroundObjects(viewPort);
    roomForeGroundRef.current = new RoomForeground(viewPort, RoomMapRef.current)
    socketRef.current = getSocket();

    const characterWidth = selectedCharacter === "Male" ? 70 : 110;
    const characterHeight = selectedCharacter === "Male" ? 70 : 120;
    const positions = {
      X: canvas.width / 2 - characterWidth,
      Y: canvas.height / 2 - characterHeight / 2
    };

    characterRef.current = new Character(
      positions.X,
      positions.Y,
      selectedCharacter,
      userData!
    );
    inputHandlerRef.current = new InputHandler();

    const initGame = async () => {
      try {
        console.log("initGame called");
        updateLoadingState({ initializing: false, connectingSocket: true });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Connecting to server...', canvas.width / 2, canvas.height / 2);

        const response = await handleSpaceCreation(
          userData?.id,
          userData?.name,
          positions,
          selectedCharacter
        );

        if (Array.isArray(response)) {
          await initRemoteUsers(response);
        }

        setupSocketListeners(
          handleUserJoined,
          handleUserMoved,
          handleUserLeft,
          handleHouseUserJoined,
          handleHouseUserMoved
        );

        updateLoadingState({ connectingSocket: false, loadingAssets: true });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Loading game assets...', canvas.width / 2, canvas.height / 2);

        await Promise.all([
          gameMapRef.current?.load("/map/metaverse map(not-zoom).png"),
          characterRef.current?.load(),
          foregroundRef.current?.load("/map/foreground image.png"),
          ...Object.values(remoteUsersRef.current).map(user => user.load())
        ]);

        console.log("All assets loaded, starting game loop");
        updateLoadingState({ loadingAssets: false, ready: true });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startGameLoop();
      } catch (error) {
        console.error("Initialization error:", error);
        updateLoadingState({
          initializing: false,
          connectingSocket: false,
          loadingAssets: false,
          ready: false
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Failed to initialize game', canvas.width / 2, canvas.height / 2);
      }
    };

    const initRemoteUsers = async (users: UsersData[]) => {
      for (const user of users) {
        if (user.userId !== userData?.id) {
          const remoteUser = new RemoteUser(
            user.positions.X,
            user.positions.Y,
            user.selectedCharacter,
            user.userId,
            user.UserName
          );
          remoteUsersRef.current[user.userId] = remoteUser;
          await remoteUser.load();
        }
      }
    };

    const initRemoteUsersHouse = async (users: UsersData[]) => {
      for (const user of users) {
        if (user.userId !== userData?.id) {
          const CharacterDimensions = {
            width: user.selectedCharacter === "Male" ? 32 : 42,
            heigth: user.selectedCharacter === 'Male' ? 40 : 48
          }
          const remoteUser = new RemoteUser(
            user.positions.X,
            user.positions.Y,
            user.selectedCharacter,
            user.userId,
            user.UserName,
            CharacterDimensions.width,
            CharacterDimensions.heigth
          );
          remoteUsersHouseRef.current[user.userId] = remoteUser;
          await remoteUser.load();
        }
      }
    };



    const handleUserJoined = (newUser: UsersData) => {
      if (newUser.userId !== userData?.id) {
        const remoteUser = new RemoteUser(
          newUser.positions.X,
          newUser.positions.Y,
          newUser.selectedCharacter,
          newUser.userId,
          newUser.UserName
        );

        remoteUser.load().then(() => {
          remoteUsersRef.current[newUser.userId] = remoteUser;
        });
      }
    };

    const handleUserMoved = (data: RemoteUserData) => {
      const remoteUser = remoteUsersRef.current[data.userId];
      if (remoteUser && remoteUser.userId !== userData?.id) {
        remoteUser.updateFromNetwork({
          positions: data.positions,
          direction: data.direction,
          isMoving: data.isMoving
        });
      }
    };

    const handleUserLeft = (data: LeftUserData) => {
      delete remoteUsersRef.current[data.userId];
      delete remoteUsersHouseRef.current[data.userId]
      //console.log("deleted user : ", remoteUsersRef.current);
    };

    const handleHouseUserJoined = (newUser: UsersData) => {
      if (newUser.userId !== userData?.id) {
        const CharacterDimensions = {
          width: newUser.selectedCharacter === "Male" ? 32 : 42,
          heigth: newUser.selectedCharacter === 'Male' ? 40 : 48
        }
        const remoteUser = new RemoteUser(
          newUser.positions.X,
          newUser.positions.Y,
          newUser.selectedCharacter,
          newUser.userId,
          newUser.UserName,
          CharacterDimensions.width,
          CharacterDimensions.heigth
        );

        remoteUser.load().then(() => {
          remoteUsersHouseRef.current[newUser.userId] = remoteUser;
        });
      }
    };

    const handleHouseUserMoved = (data: RemoteUserData) => {
      const remoteUser = remoteUsersHouseRef.current[data.userId];
      if (remoteUser && remoteUser.userId !== userData?.id) {
        remoteUser.updateFromNetwork({
          positions: data.positions,
          direction: data.direction,
          isMoving: data.isMoving
        });
      }
    };

    const startGameLoop = () => {
      const gameLoop = async () => {
        if (!ctx || !characterRef.current || !inputHandlerRef.current ||
          !gameMapRef.current || !collisionRef.current ||
          !foregroundRef.current || !roomEnterDetectRef.current || !RoomMapRef.current || !roomForeGroundRef.current) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const prevX = characterRef.current.worldX;
        const prevY = characterRef.current.worldY;

        if (!roomEnterDetectRef.current.isUserEnteredZone) {
          characterRef.current.update(inputHandlerRef.current.keys);
        }

        Object.values(remoteUsersRef.current).forEach(user => {
          user.update();
        });

        if (collisionRef.current.detectCollision(characterRef.current)) {
          characterRef.current.worldX = prevX;
          characterRef.current.worldY = prevY;
        }

        if (roomEnterDetectRef.current.detectRoomEnterZone(characterRef.current)) {
          setisTransitionShowed(true);
          setcurrentMap("House")
          const RoomPositions = {
            X: 700,
            Y: 500
          }


          const response = await handleUserEnteredRoom(
            userData?.id,
            userData?.name,
            RoomPositions,
            selectedCharacter
          )

          if (Array.isArray(response)) {
            remoteUsersRef.current = {};
            await initRemoteUsersHouse(response);
            console.log("user responsr:", response)
          }

          if (characterRef.current) {
            characterRef.current.worldX = RoomPositions.X;
            characterRef.current.worldY = RoomPositions.Y;
            characterRef.current.speed = 1.4;

            if (characterRef.current.selectedCharacter === "Male") {
              characterRef.current.width = 32;
              characterRef.current.height = 40;
            } else {
              characterRef.current.width = 42;
              characterRef.current.height = 48;
            }
          }

          roomEnterDetectRef.current.switchbetweenScenes(animationFrameRef.current);

          setisInRoom(true);
          animationFrameRef.current = 0;

          await Promise.all([
            RoomMapRef.current.load("/map/Room.png"),
            roomForeGroundRef.current.load("/map/RoomForeground.png")
          ])
          initializeRoomCollisions();

          setisTransitionShowed(false);



          startRoomGameLoop();
          return;
        }

        const movementData = {
          positions: {
            X: characterRef.current.worldX,
            Y: characterRef.current.worldY
          },
          direction: characterRef.current.direction,
          isMoving: characterRef.current.isMoving
        };

        if (Date.now() - lastNetworkUpdate.current > 100) {
          sendMovementUpdate(movementData);
          lastNetworkUpdate.current = Date.now();
        }

        gameMapRef.current.draw();
        collisionRef.current.draw(ctx);
        roomEnterDetectRef.current?.draw(ctx);
        characterRef.current.draw(ctx);

        if (currentMap === "Default") {
          Object.values(remoteUsersRef.current).forEach(user => {
            user.draw(ctx);
          });
        }

        foregroundRef.current.draw(ctx);
        console.log("running...");
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      if (!isInRoom) {
        gameLoop();
      }
    };

    initGame();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (socketRef.current) {
        socketRef.current.off("UserJoined");
        socketRef.current.off("UserMoved");
        socketRef.current.off("UserLeft");
        socketRef.current = null;
      }
      characterRef.current = null;
      gameMapRef.current = null;
      inputHandlerRef.current = null;
      collisionRef.current = null;
      foregroundRef.current = null;
      remoteUsersRef.current = {};
      RoomCollisionsRef.current = null;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [selectedCharacter, userData?.id, userData?.name]);

  const handleLeaveWorld = () => {
    if (!socketRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    if (userData?.id) {
      handleUserLeave(userData.id);
    }

    socketRef.current.off("UserJoined");
    socketRef.current.off("UserMoved");
    socketRef.current.off("UserLeft");
    socketRef.current.disconnect();
    socketRef.current = null;

    if (gameMapRef.current) {
      gameMapRef.current.isLoaded = false;
    }
    gameMapRef.current = null;
    characterRef.current = null;
    inputHandlerRef.current = null;
    collisionRef.current = null;
    foregroundRef.current = null;
    remoteUsersRef.current = {};
    RoomCollisionsRef.current = null;

    dispatch(mapDismantleState());
    toast("Leaving...");
    router.push("/dashboard?refresh=true");
  };

  const getLoadingMessage = () => {
    if (loadingStates.initializing) return "Initializing...";
    if (loadingStates.connectingSocket) return "Connecting to server...";
    if (loadingStates.loadingAssets) return "Loading game assets...";
    return "";
  };

  const isLoading = !loadingStates.ready;

  return (
    <div className='relative w-full h-screen bg-gray-900'>
      <div className='w-full h-full flex items-center justify-center'>
        {isTransitionShowed && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
              <h1 className='text-white font-bold font-michroma text-lg'>
                Hang On a little
              </h1>
              <div className='mt-2 text-gray-400 text-sm'>
                Please wait while we prepare your game...
              </div>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className='border border-black shadow-lg'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            zIndex: 2
          }}
        />
      </div>

      {isLoading && (
        <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <h1 className='text-white font-bold font-michroma text-lg'>
              {getLoadingMessage()}
            </h1>
            <div className='mt-2 text-gray-400 text-sm'>
              Please wait while we prepare your game...
            </div>
          </div>
        </div>
      )}

      <button
        className="absolute text-white cursor-pointer z-10 right-4 top-2 p-2 border-black rounded-md bg-red-400 border-[1px] font-michroma"
        onClick={() => setisOpen((prev) => !prev)}
        disabled={isLoading}
      >
        {isOpen ? "Close" : "Controls"}
      </button>

      <div
        className={`absolute z-10 right-4 top-14 p-3 bg-black/70 rounded-xl shadow-lg flex flex-col items-end space-y-3 font-michroma
          transition-all duration-300 ease-in-out transform
          ${isOpen && !isLoading ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
        `}
      >
        <button
          onClick={handleLeaveWorld}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 cursor-pointer text-white text-sm font-semibold border border-red-700 rounded-lg 
            hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Leave World
        </button>
        <Voicechat />
      </div>
    </div>
  );
}

export default GamePage;