import { GameMap } from '@/app/game/clases/GameMap';
import { Character } from '@/app/game/clases/Character';
import { Collision } from '@/app/game/clases/Collision';
import { ForegroundObjects } from '@/app/game/clases/ForegroundObjects';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { roomEnterDetect } from '@/app/game/clases/roomEnterDetect';
import { sendMovementUpdate } from '@/utils/Socket';

interface GameLoopParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  characterRef: React.RefObject<Character | null>;
  inputHandlerRef: React.RefObject<InputHandler | null>;
  gameMapRef: React.RefObject<GameMap | null>;
  collisionRef: React.RefObject<Collision | null>;
  foregroundRef: React.RefObject<ForegroundObjects | null>;
  roomEnterDetectRef: React.RefObject<roomEnterDetect | null>;
  remoteUsersRef: React.RefObject<Record<string, RemoteUser>>;
  animationFrameRef: React.RefObject<number>;
  lastNetworkUpdate: React.RefObject<number>;
  onEnterRoom: () => void;
}

export function createMainGameLoop({
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
  onEnterRoom,
}: GameLoopParams) {
  return function gameLoop() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    if (!ctx || !characterRef.current || !inputHandlerRef.current || !gameMapRef.current || 
        !collisionRef.current || !foregroundRef.current || !roomEnterDetectRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    ctx.imageSmoothingEnabled = false;
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
      onEnterRoom();
      return;
    }

    const movementData = {
      positions: { X: characterRef.current.worldX, Y: characterRef.current.worldY },
      direction: characterRef.current.direction,
      isMoving: characterRef.current.isMoving
    };
    
    if (Date.now() - lastNetworkUpdate.current > 100) {
      sendMovementUpdate(movementData);
      lastNetworkUpdate.current = Date.now();
    }

    ctx.save();
    ctx.scale(3, 3);

    const cameraX = characterRef.current.worldX - (canvas.width / 2) / 3;
    const cameraY = characterRef.current.worldY - (canvas.height / 2) / 3;
    ctx.translate(-cameraX, -cameraY);

    gameMapRef.current.draw(characterRef.current.worldX, characterRef.current.worldY);
    characterRef.current.draw(ctx);
    Object.values(remoteUsersRef.current).forEach(user => user.draw(ctx));
    foregroundRef.current.draw(ctx);

    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };
}
