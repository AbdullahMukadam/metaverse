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
import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';


function GamePage() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap>(null);
  const characterRef = useRef<Character>(null);
  const inputHandlerRef = useRef<InputHandler>(null);
  const collisionRef = useRef<Collision>(null);
  const foregroundRef = useRef<ForegroundObjects>(null);
  const remoteUsersRef = useRef<Record<string, RemoteUser>>({});
  const animationFrameRef = useRef<number>(0);
  const socketRef = useRef<Socket>(null)
  //const lastPositionRef = useRef<{ X: number; Y: number } | null>(null);
  const lastNetworkUpdate = useRef<number>(0);
  //const isToastActiveRef = useRef<boolean>(false);


  const selectedCharacter = useAppSelector((state) => state.map.character);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const collisionArrayData = exportArray;


  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("GamePage mounted, canvasRef.current:", canvasRef.current);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    gameMapRef.current = null;
    characterRef.current = null;
    inputHandlerRef.current = null;
    collisionRef.current = null;
    foregroundRef.current = null;
    remoteUsersRef.current = {};

    const viewPort = { width: 1280, height: 720 };

    canvas.width = viewPort.width;
    canvas.height = viewPort.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }


    gameMapRef.current = new GameMap(canvas, viewPort);
    collisionRef.current = new Collision(collisionArrayData);
    foregroundRef.current = new ForegroundObjects(viewPort);
    socketRef.current = getSocket()


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

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        await Promise.all([
          gameMapRef.current?.load("/map/metaverse map(not-zoom).png"),
          characterRef.current?.load(),
          foregroundRef.current?.load("/map/foreground image.png"),
          ...Object.values(remoteUsersRef.current).map(user => user.load())
        ]);
        console.log("All assets loaded, starting game loop");
        startGameLoop();
      } catch (error) {
        console.error("Initialization error:", error);
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

        /* if (!isToastActiveRef.current) {
          isToastActiveRef.current = true;
          
          toast(`${newUser.UserName} has joined the space.`, {
            onDismiss: () => {
              isToastActiveRef.current = false;
            },
            onAutoClose: () => {
              isToastActiveRef.current = false;
            }
          });
          
          
          setTimeout(() => {
            isToastActiveRef.current = false;
          }, 4000);
        } */

      }
    };

    const handleUserMoved = (data: RemoteUserData) => {
      const remoteUser = remoteUsersRef.current[data.userId];
      if (remoteUser.userId !== userData?.id) {
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
      gameMapRef.current.isLoaded = false
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

      <div className='absolute z-10 right-3 bottom-[10%] p-3'>
        <button
          className='p-2 bg-red-500 font-semibold cursor-pointer z-10 rounded-2xl border border-black font-michroma text-white hover:bg-red-600 transition-colors'
          onClick={handleLeaveWorld}
        >
          Leave World
        </button>
      </div>
    </div>
  );
}

export default GamePage;