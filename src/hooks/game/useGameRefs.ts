import { useRef } from 'react';
import { Character } from '@/app/game/clases/Character';
import { Collision } from '@/app/game/clases/Collision';
import { RoomCollision } from '@/app/game/clases/RoomCollision';
import { ForegroundObjects } from '@/app/game/clases/ForegroundObjects';
import { GameMap } from '@/app/game/clases/GameMap';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { RoomMap } from '@/app/game/clases/RoomMap';
import { RoomForeground } from '@/app/game/clases/RoomForeground';
import { roomEnterDetect } from '@/app/game/clases/roomEnterDetect';
import { roomLeaveDetect } from '@/app/game/clases/roomLeaveDetect';
import { MusicPositionEnteredDetect } from '@/app/game/clases/MusicPositionDetect';
import { Socket } from 'socket.io-client';

export function useGameRefs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap | null>(null);
  const characterRef = useRef<Character | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const collisionRef = useRef<Collision | null>(null);
  const foregroundRef = useRef<ForegroundObjects | null>(null);
  const remoteUsersRef = useRef<Record<string, RemoteUser>>({});
  const remoteUsersHouseRef = useRef<Record<string, RemoteUser>>({});
  const animationFrameRef = useRef<number>(0);
  const socketRef = useRef<Socket | null>(null);
  const lastNetworkUpdate = useRef<number>(0);
  const roomEnterDetectRef = useRef<roomEnterDetect | null>(null);
  const RoomMapRef = useRef<RoomMap | null>(null);
  const RoomCollisionsRef = useRef<RoomCollision | null>(null);
  const roomForeGroundRef = useRef<RoomForeground | null>(null);
  const roomLeaveDetectRef = useRef<roomLeaveDetect | null>(null);
  const playerReachedToMusicPlaceRef = useRef<MusicPositionEnteredDetect | null>(null);

  return {
    canvasRef,
    gameMapRef,
    characterRef,
    inputHandlerRef,
    collisionRef,
    foregroundRef,
    remoteUsersRef,
    remoteUsersHouseRef,
    animationFrameRef,
    socketRef,
    lastNetworkUpdate,
    roomEnterDetectRef,
    RoomMapRef,
    RoomCollisionsRef,
    roomForeGroundRef,
    roomLeaveDetectRef,
    playerReachedToMusicPlaceRef,
  };
}
