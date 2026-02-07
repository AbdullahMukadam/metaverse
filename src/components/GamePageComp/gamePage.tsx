"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { mapDismantleState } from '@/lib/map/mapSlice';
import { useGameRefs } from '@/hooks/game/useGameRefs';
import { useGameState } from '@/hooks/game/useGameState';
import { useCharacterManager } from '@/hooks/game/useCharacterManager';
import { useCollisionManager } from '@/hooks/game/useCollisionManager';
import { useSocketHandlers } from '@/hooks/game/useSocketHandlers';
import { createMainGameLoop } from '@/lib/game/mainGameLoop';
import { createRoomGameLoop } from '@/lib/game/roomGameLoop';
import {
  getSocket,
  handleSpaceCreation,
  handleUserEnteredRoom,
  handleUserLeave,
  handleLeaveHouseAndRejoinMain,
  setupSocketListeners,
} from '@/utils/Socket';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import ChatPanel from '../Chat/ChatPanel';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';


export default function GamePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const selectedCharacter = useAppSelector((state) => state.map.character);
  const roomId = useAppSelector((state) => state.map.roomId);
  const userData = useAppSelector((state) => state.auth.userData);

  // Game refs
  const refs = useGameRefs();
  const {
    canvasRef,
    gameMapRef,
    RoomMapRef,
    characterRef,
    inputHandlerRef,
    collisionRef,
    RoomCollisionsRef,
    foregroundRef,
    roomForeGroundRef,
    remoteUsersRef,
    remoteUsersHouseRef,
    animationFrameRef,
    socketRef,
    lastNetworkUpdate,
    roomEnterDetectRef,
    roomLeaveDetectRef,
    playerReachedToMusicPlaceRef,
  } = refs;

  // Game state
  const {
    isOpen,
    setIsOpen,
    isTransitionShowed,
    setIsTransitionShowed,
    isUserEnteredMusicZone,
    setIsUserEnteredMusicZone,
    updateLoadingState,
    getLoadingMessage,
    isLoading,
  } = useGameState();

  // Character management
  const {
    initRemoteUsers,
    initRemoteUsersHouse,
    resetCharacterPosition,
  } = useCharacterManager(characterRef, remoteUsersRef, remoteUsersHouseRef);

  // Collision management
  const { initializeMainCollisions, initializeRoomCollisions } = useCollisionManager(
    collisionRef,
    RoomCollisionsRef,
    RoomMapRef
  );

  // Socket handlers
  const socketHandlers = useSocketHandlers(remoteUsersRef, remoteUsersHouseRef, userData?.id);

  // Game loop starters
  const startMainLoop = useCallback(() => {
    const gameLoop = createMainGameLoop({
      canvasRef,
      characterRef,
      inputHandlerRef,
      gameMapRef,
      collisionRef,
      foregroundRef,
      roomEnterDetectRef,
      remoteUsersRef,
      animationFrameRef,
      lastNetworkUpdate,
      onEnterRoom: () => handleEnterRoom(),
    });
    gameLoop();
  }, [refs, socketHandlers]);

  const handleEnterRoom = useCallback(async () => {
    setIsTransitionShowed(true);
    const RoomPositions = { X: 700, Y: 500 };
    const response = await handleUserEnteredRoom(userData?.id, userData?.name, RoomPositions, selectedCharacter, roomId);
    
    if (Array.isArray(response)) {
      remoteUsersRef.current = {};
      await initRemoteUsersHouse(response);
    }

    resetCharacterPosition(RoomPositions.X, RoomPositions.Y, true);
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;

    await Promise.all([
      RoomMapRef.current?.load("/map/Room.png"),
      roomForeGroundRef.current?.load("/map/RoomForeground.png"),
    ]);
    
    initializeRoomCollisions();
    setIsTransitionShowed(false);
    startRoomLoop();
  }, [userData, selectedCharacter, roomId]);

  const handleLeaveRoom = useCallback(async () => {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;
    setIsTransitionShowed(true);

    try {
      if (!userData?.id) throw new Error("User ID is missing.");
      const mainWorldUsers = await handleLeaveHouseAndRejoinMain(userData.id, roomId);

      if (mainWorldUsers === false) {
        throw new Error("Server failed to process the transition.");
      }

      remoteUsersHouseRef.current = {};
      remoteUsersRef.current = {};
      await initRemoteUsers(mainWorldUsers);
      resetCharacterPosition(300, 300, false);

      setIsTransitionShowed(false);
      startMainLoop();
    } catch (error) {
      console.error("Failed to transition back to main world:", error);
      toast.error("Could not return to the main world. Please refresh.");
    }
  }, [userData?.id, roomId]);

  const startRoomLoop = useCallback(() => {
    const roomLoop = createRoomGameLoop({
      canvasRef,
      characterRef,
      inputHandlerRef,
      RoomMapRef,
      RoomCollisionsRef,
      roomForeGroundRef,
      roomLeaveDetectRef,
      playerReachedToMusicPlaceRef,
      remoteUsersHouseRef,
      animationFrameRef,
      lastNetworkUpdate,
      onLeaveRoom: handleLeaveRoom,
      onEnterMusicZone: () => setIsUserEnteredMusicZone(true),
    });
    roomLoop();
  }, [refs, handleLeaveRoom]);

  // Initialize game
  useEffect(() => {
    if (animationFrameRef.current !== 0) return;
    if (!canvasRef.current) return;

    const initGame = async () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Setup canvas
      const viewPort = { width: window.innerWidth, height: window.innerHeight };
      canvas.width = viewPort.width;
      canvas.height = viewPort.height;
      ctx.imageSmoothingEnabled = false;

      // Show loading
      updateLoadingState({ initializing: true });
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Initializing Game...', canvas.width / 2, canvas.height / 2);

      // Initialize game objects
      gameMapRef.current = new (await import('@/app/game/clases/GameMap')).GameMap(canvas, viewPort);
      initializeMainCollisions();
      
      const { roomEnterDetect } = await import('@/app/game/clases/roomEnterDetect');
      const { roomLeaveDetect } = await import('@/app/game/clases/roomLeaveDetect');
      const { MusicPositionEnteredDetect } = await import('@/app/game/clases/MusicPositionDetect');
      const { RoomMap } = await import('@/app/game/clases/RoomMap');
      const { ForegroundObjects } = await import('@/app/game/clases/ForegroundObjects');
      const { RoomForeground } = await import('@/app/game/clases/RoomForeground');
      const { InputHandler } = await import('@/app/game/clases/InputHandler');
      const { Character } = await import('@/app/game/clases/Character');

      roomEnterDetectRef.current = new roomEnterDetect((await import('@/utils/roomEnterData')).exportRoomEnterArray);
      roomLeaveDetectRef.current = new roomLeaveDetect((await import('@/utils/roomOutData')).ExportroomOutDataArray);
      playerReachedToMusicPlaceRef.current = new MusicPositionEnteredDetect((await import('@/utils/MusicData')).ExportMusicDataArray);
      RoomMapRef.current = new RoomMap(viewPort, canvas);
      foregroundRef.current = new ForegroundObjects(viewPort);
      roomForeGroundRef.current = new RoomForeground(viewPort, RoomMapRef.current);
      socketRef.current = getSocket();
      inputHandlerRef.current = new InputHandler();

      // Initialize character
      const positions = { X: 300, Y: 300 };
      characterRef.current = new Character(positions.X, positions.Y, selectedCharacter, userData!);

      // Setup socket listeners
      setupSocketListeners(
        socketHandlers.handleUserJoined,
        socketHandlers.handleUserMoved,
        socketHandlers.handleUserLeft,
        socketHandlers.handleHouseUserJoined,
        socketHandlers.handleHouseUserMoved,
        socketHandlers.handleUserLeaveHouse
      );

      // Connect and load
      updateLoadingState({ initializing: false, connectingSocket: true });
      ctx.fillText('Connecting to server...', canvas.width / 2, canvas.height / 2);
      
      const response = await handleSpaceCreation(userData?.id, userData?.name, positions, selectedCharacter, roomId);
      if (Array.isArray(response)) {
        await initRemoteUsers(response);
      }

      updateLoadingState({ connectingSocket: false, loadingAssets: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText('Loading game assets...', canvas.width / 2, canvas.height / 2);

      await Promise.all([
        gameMapRef.current?.load("/map/metaverse map(not-zoom).png"),
        characterRef.current?.load(),
        foregroundRef.current?.load("/map/foreground image.png"),
        ...Object.values(remoteUsersRef.current).map(user => user.load()),
      ]);

      updateLoadingState({ loadingAssets: false, ready: true });
      startMainLoop();
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

  const handleMusicPlayerClose = () => {
    setIsUserEnteredMusicZone(false);
  };

  return (
    <div className='relative w-full h-screen bg-[#67E6D2]'>
      <div className='w-full h-full flex items-center justify-center'>
        <GameCanvas
          ref={canvasRef}
          isLoading={isLoading}
          isTransitionShowed={isTransitionShowed}
          loadingMessage={getLoadingMessage()}
        />
      </div>

      {isUserEnteredMusicZone && (
        <div className='absolute top-0 p-3 w-full h-full flex items-center justify-center z-40'>
          <MusicPlayer handleMusicClose={handleMusicPlayerClose} />
        </div>
      )}

      <GameUI
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
        roomId={roomId}
        userData={userData}
        onLeaveWorld={handleLeaveWorld}
      />

      {!isLoading && userData && (
        <ChatPanel
          roomId={roomId}
          userId={userData.id}
          userName={userData.name}
          userImage={userData.image || undefined}
        />
      )}
    </div>
  );
}
