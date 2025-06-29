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
  handleUserLeave,
  LeftUserData,
  RemoteUserData,
  sendMovementUpdate,
  setupSocketListeners,
  UsersData
} from '@/utils/Socket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import Voicechat from '../VoiceChat/Voicechat';

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap>(null);
  const characterRef = useRef<Character>(null);
  const inputHandlerRef = useRef<InputHandler>(null);
  const collisionRef = useRef<Collision>(null);
  const foregroundRef = useRef<ForegroundObjects>(null);
  const remoteUsersRef = useRef<Record<string, RemoteUser>>({});
  const animationFrameRef = useRef<number>(0);
  const socketRef = useRef<Socket>(null);
  const lastNetworkUpdate = useRef<number>(0);

  const selectedCharacter = useAppSelector((state) => state.map.character);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const collisionArrayData = exportArray;

  const [isOpen, setisOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    initializing: true,
    connectingSocket: false,
    loadingAssets: false,
    ready: false
  });

  
  const updateLoadingState = (updates: Partial<typeof loadingStates>) => {
    setLoadingStates(prev => ({ ...prev, ...updates }));
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

    
    ctx.fillStyle = '#1f2937'; // gray800
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Initializing Game...', canvas.width / 2, canvas.height / 2);

    
    gameMapRef.current = null;
    characterRef.current = null;
    inputHandlerRef.current = null;
    collisionRef.current = null;
    foregroundRef.current = null;
    remoteUsersRef.current = {};

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

   
    gameMapRef.current = new GameMap(canvas, viewPort);
    collisionRef.current = new Collision(collisionArrayData);
    foregroundRef.current = new ForegroundObjects(viewPort);
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
          handleUserLeft
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
        ctx.fillStyle = '#ef4444'; // red500
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
      console.log("deleted user : ", remoteUsersRef.current);
    };

    const startGameLoop = () => {
      const gameLoop = () => {
        if (!ctx || !characterRef.current || !inputHandlerRef.current ||
          !gameMapRef.current || !collisionRef.current ||
          !foregroundRef.current) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const prevX = characterRef.current.worldX;
        const prevY = characterRef.current.worldY;
        characterRef.current.update(inputHandlerRef.current.keys);

        Object.values(remoteUsersRef.current).forEach(user => {
          user.update();
        });

        if (collisionRef.current.detectCollision(characterRef.current)) {
          characterRef.current.worldX = prevX;
          characterRef.current.worldY = prevY;
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
        characterRef.current.draw(ctx);

        Object.values(remoteUsersRef.current).forEach(user => {
          user.draw(ctx);
        });

        foregroundRef.current.draw(ctx);

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);
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