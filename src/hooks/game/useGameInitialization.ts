import { useCallback, useEffect } from 'react';
import { Character } from '@/app/game/clases/Character';
import { GameMap } from '@/app/game/clases/GameMap';
import { RoomMap } from '@/app/game/clases/RoomMap';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { ForegroundObjects } from '@/app/game/clases/ForegroundObjects';
import { RoomForeground } from '@/app/game/clases/RoomForeground';
import { roomEnterDetect } from '@/app/game/clases/roomEnterDetect';
import { roomLeaveDetect } from '@/app/game/clases/roomLeaveDetect';
import { MusicPositionEnteredDetect } from '@/app/game/clases/MusicPositionDetect';
import { getSocket } from '@/utils/Socket';
import { exportRoomEnterArray } from '@/utils/roomEnterData';
import { ExportroomOutDataArray } from '@/utils/roomOutData';
import { ExportMusicDataArray } from '@/utils/MusicData';
import { exportArray } from '@/utils/collisionsData';
import { createMainGameLoop } from '@/lib/game/mainGameLoop';
import { createRoomGameLoop } from '@/lib/game/roomGameLoop';

interface UseGameInitializationParams {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameMapRef: React.RefObject<GameMap | null>;
  RoomMapRef: React.RefObject<RoomMap | null>;
  characterRef: React.RefObject<Character | null>;
  inputHandlerRef: React.RefObject<InputHandler | null>;
  foregroundRef: React.RefObject<ForegroundObjects | null>;
  roomForeGroundRef: React.RefObject<RoomForeground | null>;
  roomEnterDetectRef: React.RefObject<roomEnterDetect | null>;
  roomLeaveDetectRef: React.RefObject<roomLeaveDetect | null>;
  playerReachedToMusicPlaceRef: React.RefObject<MusicPositionEnteredDetect | null>;
  socketRef: React.RefObject<ReturnType<typeof getSocket> | null>;
  animationFrameRef: React.RefObject<number>;
  initializeMainCollisions: () => void;
  initializeRoomCollisions: () => void;
  initRemoteUsers: (users: any[]) => Promise<void>;
  updateLoadingState: (updates: any) => void;
  selectedCharacter: string;
  userData: any;
  startMainLoop: () => void;
  startRoomLoop: () => void;
}

export function useGameInitialization({
  canvasRef,
  gameMapRef,
  RoomMapRef,
  characterRef,
  inputHandlerRef,
  foregroundRef,
  roomForeGroundRef,
  roomEnterDetectRef,
  roomLeaveDetectRef,
  playerReachedToMusicPlaceRef,
  socketRef,
  animationFrameRef,
  initializeMainCollisions,
  initializeRoomCollisions,
  initRemoteUsers,
  updateLoadingState,
  selectedCharacter,
  userData,
  startMainLoop,
  startRoomLoop,
}: UseGameInitializationParams) {
  
  const collisionArrayData = exportArray;
  const roomEnterArrayData = exportRoomEnterArray;
  const roomLeaveArrayData = ExportroomOutDataArray;
  const MusicPlayerArrayData = ExportMusicDataArray;

  const initializeGame = useCallback(async () => {
    if (animationFrameRef.current !== 0) return;
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateLoadingState({ initializing: true, connectingSocket: false, loadingAssets: false, ready: false });

    const viewPort = { width: window.innerWidth, height: window.innerHeight };
    canvas.width = viewPort.width;
    canvas.height = viewPort.height;

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Initializing Game...', canvas.width / 2, canvas.height / 2);

    // Initialize game objects
    gameMapRef.current = new GameMap(canvas, viewPort);
    initializeMainCollisions();
    roomEnterDetectRef.current = new roomEnterDetect(roomEnterArrayData);
    roomLeaveDetectRef.current = new roomLeaveDetect(roomLeaveArrayData);
    playerReachedToMusicPlaceRef.current = new MusicPositionEnteredDetect(MusicPlayerArrayData);
    RoomMapRef.current = new RoomMap(viewPort, canvas);
    foregroundRef.current = new ForegroundObjects(viewPort);
    roomForeGroundRef.current = new RoomForeground(viewPort, RoomMapRef.current);
    socketRef.current = getSocket();
    inputHandlerRef.current = new InputHandler();

    // Initialize character
    const positions = { X: 300, Y: 300 };
    characterRef.current = new Character(positions.X, positions.Y, selectedCharacter, userData!);

    return { canvas, ctx, viewPort, positions };
  }, [/* dependencies */]);

  return { initializeGame };
}
