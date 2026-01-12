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
  handleLeaveHouseAndRejoinMain,
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
import { MusicPositionEnteredDetect } from '@/app/game/clases/MusicPositionDetect';
import { ExportMusicDataArray } from '@/utils/MusicData';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

function GamePage() {
  // Hooks and Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap | null>(null);
  const characterRef = useRef<Character | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const collisionRef = useRef<Collision | null>(null);
  const foregroundRef = useRef<ForegroundObjects | null>(null);
  const remoteUsersRef = useRef<Record<string, RemoteUser>>({});
  const remoteUsersHouseRef = useRef<Record<string, RemoteUser>>({})
  const animationFrameRef = useRef<number>(0);
  const socketRef = useRef<Socket | null>(null);
  const lastNetworkUpdate = useRef<number>(0);
  const roomEnterDetectRef = useRef<roomEnterDetect | null>(null);
  const RoomMapRef = useRef<RoomMap | null>(null);
  const RoomCollisionsRef = useRef<Collision | null>(null);
  const roomForeGroundRef = useRef<RoomForeground | null>(null);
  const roomLeaveDetectRef = useRef<roomLeaveDetect | null>(null);
  const playerReachedToMusicPlaceRef = useRef<MusicPositionEnteredDetect | null>(null);

  const selectedCharacter = useAppSelector((state) => state.map.character);
  const roomId = useAppSelector((state) => state.map.roomId);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isOpen, setisOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({ initializing: true, connectingSocket: false, loadingAssets: false, ready: false });
  const [isTransitionShowed, setisTransitionShowed] = useState(false);
  const [isUserEnteredMusicZone, setisUserEnteredMusicZone] = useState(false)
  // const [isInRoom, setisInRoom] = useState(false);
  // const [currentMap, setcurrentMap] = useState("Default")


  const collisionArrayData = exportArray;
  const roomEnterArrayData = exportRoomEnterArray;
  const roomCollisionsDataArray = ExportroomCollisionArray;
  const roomLeaveArrayData = ExportroomOutDataArray;
  const MusicPlayerArrayData = ExportMusicDataArray;

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

  const initRemoteUsers = async (users: UsersData[]) => {
    for (const user of users) {
      if (user.userId !== userData?.id) {
        const remoteUser = new RemoteUser(user.positions.X, user.positions.Y, user.selectedCharacter, user.userId, user.UserName);
        remoteUsersRef.current[user.userId] = remoteUser;
        await remoteUser.load();
      }
    }
  };

  const initRemoteUsersHouse = async (users: UsersData[]) => {
    for (const user of users) {
      if (user.userId !== userData?.id) {
        const CharacterDimensions = { width: user.selectedCharacter === "Male" ? 32 : 42, heigth: user.selectedCharacter === 'Male' ? 40 : 48 };
        const remoteUser = new RemoteUser(user.positions.X, user.positions.Y, user.selectedCharacter, user.userId, user.UserName, CharacterDimensions.width, CharacterDimensions.heigth);
        remoteUsersHouseRef.current[user.userId] = remoteUser;
        await remoteUser.load();
      }
    }
  };

  const startRoomGameLoop = () => {
    const RoomgameLoop = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      if (!ctx || !characterRef.current || !inputHandlerRef.current || !RoomMapRef.current || !RoomCollisionsRef.current || !roomForeGroundRef.current || !roomLeaveDetectRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const prevX = characterRef.current.worldX;
      const prevY = characterRef.current.worldY;

      characterRef.current.update(inputHandlerRef.current.keys);

      if (RoomCollisionsRef.current.detectCollision(characterRef.current)) {
        characterRef.current.worldX = prevX;
        characterRef.current.worldY = prevY;
      }

      if (playerReachedToMusicPlaceRef.current?.detectMusicZone(characterRef.current)) {
        setisUserEnteredMusicZone(true);
        characterRef.current.worldX = prevX;
        characterRef.current.worldY = prevY;
      }

      if (roomLeaveDetectRef.current.detectRoomLeaveZone(characterRef.current)) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
        setisTransitionShowed(true);

          const transitionToMainWorld = async () => {
            try {
              if (!userData?.id) throw new Error("User ID is missing.");
              const mainWorldUsers = await handleLeaveHouseAndRejoinMain(userData.id, roomId);

              if (mainWorldUsers === false) {
                throw new Error("Server failed to process the transition.");
              }

            remoteUsersHouseRef.current = {};
            remoteUsersRef.current = {};
            await initRemoteUsers(mainWorldUsers);

            if (characterRef.current) {
              const mainWorldEntryPositions = { X: 570, Y: 325 };
              characterRef.current.worldX = mainWorldEntryPositions.X;
              characterRef.current.worldY = mainWorldEntryPositions.Y;
              characterRef.current.speed = 1;
              characterRef.current.width = characterRef.current.selectedCharacter === "Male" ? 23 : 27;
              characterRef.current.height = characterRef.current.selectedCharacter === "Male" ? 27 : 32;
            }

            // setisInRoom(false);
            // setcurrentMap("Default");
            setisTransitionShowed(false);
            startGameLoop();
          } catch (error) {
            console.error("Failed to transition back to main world:", error);
            toast.error("Could not return to the main world. Please refresh.");
          }
        };

        transitionToMainWorld();
        return;
      }

      const movementData = { positions: { X: characterRef.current.worldX, Y: characterRef.current.worldY }, direction: characterRef.current.direction, isMoving: characterRef.current.isMoving };
      if (Date.now() - lastNetworkUpdate.current > 100) {
        sendHouseMovementUpdate(movementData);
        lastNetworkUpdate.current = Date.now();
      }

      RoomMapRef.current.draw(ctx);
      characterRef.current.draw(ctx);
      Object.values(remoteUsersHouseRef.current).forEach(user => user.draw(ctx));
      roomForeGroundRef.current?.draw(ctx);
      playerReachedToMusicPlaceRef.current?.draw(ctx);

      animationFrameRef.current = requestAnimationFrame(RoomgameLoop);
    };
    animationFrameRef.current = requestAnimationFrame(RoomgameLoop);
  };

  const startGameLoop = () => {
    const gameLoop = async () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      if (!ctx || !characterRef.current || !inputHandlerRef.current || !gameMapRef.current || !collisionRef.current || !foregroundRef.current || !roomEnterDetectRef.current || !RoomMapRef.current || !roomForeGroundRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const prevX = characterRef.current.worldX;
      const prevY = characterRef.current.worldY;

      characterRef.current.update(inputHandlerRef.current.keys);
      Object.values(remoteUsersRef.current).forEach(user => user.update());

      if (collisionRef.current.detectCollision(characterRef.current)) {
        characterRef.current.worldX = prevX;
        characterRef.current.worldY = prevY;
      }

      if (roomEnterDetectRef.current.detectRoomEnterZone(characterRef.current)) {
        setisTransitionShowed(true);
        const RoomPositions = { X: 700, Y: 500 };
        const response = await handleUserEnteredRoom(userData?.id, userData?.name, RoomPositions, selectedCharacter, roomId);
        if (Array.isArray(response)) {
          remoteUsersRef.current = {};
          await initRemoteUsersHouse(response);
        }

        if (characterRef.current) {
          characterRef.current.worldX = RoomPositions.X;
          characterRef.current.worldY = RoomPositions.Y;
          characterRef.current.speed = 1.4;
          characterRef.current.width = characterRef.current.selectedCharacter === "Male" ? 32 : 42;
          characterRef.current.height = characterRef.current.selectedCharacter === "Male" ? 40 : 48;
        }

        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
        // setisInRoom(true);
        // setcurrentMap("House");

        await Promise.all([RoomMapRef.current.load("/map/Room.png"), roomForeGroundRef.current.load("/map/RoomForeground.png")]);
        initializeRoomCollisions();
        setisTransitionShowed(false);
        startRoomGameLoop();
        return;
      }

      const movementData = { positions: { X: characterRef.current.worldX, Y: characterRef.current.worldY }, direction: characterRef.current.direction, isMoving: characterRef.current.isMoving };
      if (Date.now() - lastNetworkUpdate.current > 100) {
        sendMovementUpdate(movementData);
        lastNetworkUpdate.current = Date.now();
      }

      gameMapRef.current.draw();
      characterRef.current.draw(ctx);
      Object.values(remoteUsersRef.current).forEach(user => user.draw(ctx));
      foregroundRef.current.draw(ctx);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  useEffect(() => {
    if (animationFrameRef.current !== 0) {
      return;
    }

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateLoadingState({ initializing: true, connectingSocket: false, loadingAssets: false, ready: false });

    const viewPort = { width: 1280, height: 720 };
    canvas.width = viewPort.width;
    canvas.height = viewPort.height;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Initializing Game...', canvas.width / 2, canvas.height / 2);

    gameMapRef.current = new GameMap(canvas, viewPort);
    collisionRef.current = new Collision(collisionArrayData, 1025);
    roomEnterDetectRef.current = new roomEnterDetect(roomEnterArrayData);
    roomLeaveDetectRef.current = new roomLeaveDetect(roomLeaveArrayData);
    playerReachedToMusicPlaceRef.current = new MusicPositionEnteredDetect(MusicPlayerArrayData);
    RoomMapRef.current = new RoomMap(viewPort, canvas);
    foregroundRef.current = new ForegroundObjects(viewPort);
    roomForeGroundRef.current = new RoomForeground(viewPort, RoomMapRef.current);
    socketRef.current = getSocket();
    inputHandlerRef.current = new InputHandler();

    const characterWidth = selectedCharacter === "Male" ? 70 : 110;
    const characterHeight = selectedCharacter === "Male" ? 70 : 120;
    const positions = {
      X: canvas.width / 2 - characterWidth,
      Y: canvas.height / 2 - characterHeight / 2
    };
    //console.log("characterPositions", 570 , 325)
    characterRef.current = new Character(positions.X, positions.Y, selectedCharacter, userData!);

    const handleUserJoined = (newUser: UsersData) => { if (newUser.userId !== userData?.id) { const remoteUser = new RemoteUser(newUser.positions.X, newUser.positions.Y, newUser.selectedCharacter, newUser.userId, newUser.UserName); remoteUser.load().then(() => { remoteUsersRef.current[newUser.userId] = remoteUser; }); } };
    const handleUserMoved = (data: RemoteUserData) => { const remoteUser = remoteUsersRef.current[data.userId]; if (remoteUser) { remoteUser.updateFromNetwork(data); } };
    const handleUserLeft = (data: LeftUserData) => { delete remoteUsersRef.current[data.userId]; delete remoteUsersHouseRef.current[data.userId]; };
    const handleUserLeaveHouse = (data: { userId: string }) => { delete remoteUsersHouseRef.current[data.userId]; };
    const handleHouseUserJoined = (newUser: UsersData) => { if (newUser.userId !== userData?.id) { const dims = { w: newUser.selectedCharacter === "Male" ? 32 : 42, h: newUser.selectedCharacter === 'Male' ? 40 : 48 }; const remoteUser = new RemoteUser(newUser.positions.X, newUser.positions.Y, newUser.selectedCharacter, newUser.userId, newUser.UserName, dims.w, dims.h); remoteUser.load().then(() => { remoteUsersHouseRef.current[newUser.userId] = remoteUser; }); } };
    const handleHouseUserMoved = (data: RemoteUserData) => { const remoteUser = remoteUsersHouseRef.current[data.userId]; if (remoteUser) { remoteUser.updateFromNetwork(data); } };

    const initGame = async () => {
      try {
        updateLoadingState({ initializing: false, connectingSocket: true });
        ctx.fillText('Connecting to server...', canvas.width / 2, canvas.height / 2);
        const response = await handleSpaceCreation(userData?.id, userData?.name, positions, selectedCharacter, roomId);
        if (Array.isArray(response)) {
          await initRemoteUsers(response);
        }
        setupSocketListeners(handleUserJoined, handleUserMoved, handleUserLeft, handleHouseUserJoined, handleHouseUserMoved, handleUserLeaveHouse);
        updateLoadingState({ connectingSocket: false, loadingAssets: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText('Loading game assets...', canvas.width / 2, canvas.height / 2);
        await Promise.all([gameMapRef.current?.load("/map/metaverse map(not-zoom).png"), characterRef.current?.load(), foregroundRef.current?.load("/map/foreground image.png"), ...Object.values(remoteUsersRef.current).map(user => user.load())]);
        updateLoadingState({ loadingAssets: false, ready: true });
        startGameLoop();
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize game.");
      }
    };

    initGame();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
      if (socketRef.current) {
        socketRef.current.off("UserJoined");
        socketRef.current.off("UserMoved");
        socketRef.current.off("UserLeft");
        socketRef.current.off("HouseUserJoined");
        socketRef.current.off("HouseUserMoved");
      }
    };
  }, [selectedCharacter, userData?.id, userData?.name, roomId]);

  const handleLeaveWorld = () => {
    if (!socketRef.current) return;
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;
    if (userData?.id) {
      handleUserLeave(userData.id);
    }
    socketRef.current.disconnect();
    socketRef.current = null;
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

  const handleMusicPlayerClose = () : void => {
    setisUserEnteredMusicZone(false)
  }

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


      {
        isUserEnteredMusicZone && (
          <div className='absolute top-0 p-3 w-full h-full flex items-center justify-center z-40'>
            <MusicPlayer handleMusicClose={handleMusicPlayerClose} />
          </div>
        )
      }


      <button
        className="absolute text-white cursor-pointer z-50 right-4 top-2 p-2 border-black rounded-md bg-red-400 border-[1px] font-michroma"
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
