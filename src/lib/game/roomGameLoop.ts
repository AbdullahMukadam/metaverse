import { RoomMap } from '@/app/game/clases/RoomMap';
import { Character } from '@/app/game/clases/Character';
import { RoomCollision } from '@/app/game/clases/RoomCollision';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { RoomForeground } from '@/app/game/clases/RoomForeground';
import { roomLeaveDetect } from '@/app/game/clases/roomLeaveDetect';
import { MusicPositionEnteredDetect } from '@/app/game/clases/MusicPositionDetect';
import { sendHouseMovementUpdate } from '@/utils/Socket';

interface RoomLoopParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  characterRef: React.RefObject<Character | null>;
  inputHandlerRef: React.RefObject<InputHandler | null>;
  RoomMapRef: React.RefObject<RoomMap | null>;
  RoomCollisionsRef: React.RefObject<RoomCollision | null>;
  roomForeGroundRef: React.RefObject<RoomForeground | null>;
  roomLeaveDetectRef: React.RefObject<roomLeaveDetect | null>;
  playerReachedToMusicPlaceRef: React.RefObject<MusicPositionEnteredDetect | null>;
  remoteUsersHouseRef: React.RefObject<Record<string, RemoteUser>>;
  animationFrameRef: React.RefObject<number>;
  lastNetworkUpdate: React.RefObject<number>;
  onLeaveRoom: () => void;
  onEnterMusicZone: () => void;
}

export function createRoomGameLoop({
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
  onLeaveRoom,
  onEnterMusicZone,
}: RoomLoopParams) {
  return function roomGameLoop() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    if (!ctx || !characterRef.current || !inputHandlerRef.current || !RoomMapRef.current || 
        !RoomCollisionsRef.current || !roomForeGroundRef.current || !roomLeaveDetectRef.current) {
      animationFrameRef.current = requestAnimationFrame(roomGameLoop);
      return;
    }

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevX = characterRef.current.worldX;
    const prevY = characterRef.current.worldY;

    characterRef.current.update(inputHandlerRef.current.keys);

    if (RoomCollisionsRef.current.detectCollision(characterRef.current)) {
      characterRef.current.worldX = prevX;
      characterRef.current.worldY = prevY;
    }

    if (playerReachedToMusicPlaceRef.current?.detectMusicZone(characterRef.current)) {
      onEnterMusicZone();
      characterRef.current.worldX = prevX;
      characterRef.current.worldY = prevY;
    }

    if (roomLeaveDetectRef.current.detectRoomLeaveZone(characterRef.current)) {
      onLeaveRoom();
      return;
    }

    const movementData = {
      positions: { X: characterRef.current.worldX, Y: characterRef.current.worldY },
      direction: characterRef.current.direction,
      isMoving: characterRef.current.isMoving
    };

    if (Date.now() - lastNetworkUpdate.current > 100) {
      sendHouseMovementUpdate(movementData);
      lastNetworkUpdate.current = Date.now();
    }

    RoomMapRef.current.draw(ctx);
    
    if (RoomCollisionsRef.current) {
      RoomCollisionsRef.current.draw(ctx);
    }

    characterRef.current.draw(ctx);
    Object.values(remoteUsersHouseRef.current).forEach(user => user.draw(ctx));
    roomForeGroundRef.current?.draw(ctx);
    playerReachedToMusicPlaceRef.current?.draw(ctx);

    animationFrameRef.current = requestAnimationFrame(roomGameLoop);
  };
}
