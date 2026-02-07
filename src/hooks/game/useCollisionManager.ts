import { useCallback } from 'react';
import { RoomMap } from '@/app/game/clases/RoomMap';
import { RoomCollision } from '@/app/game/clases/RoomCollision';
import { Collision } from '@/app/game/clases/Collision';
import { exportArray } from '@/utils/collisionsData';
import { ExportroomCollisionArray } from '@/utils/RoomCollisionsData';

export function useCollisionManager(
  collisionRef: React.RefObject<Collision | null>,
  RoomCollisionsRef: React.RefObject<RoomCollision | null>,
  RoomMapRef: React.RefObject<RoomMap | null>
) {
  const collisionArrayData = exportArray;
  const roomCollisionsDataArray = ExportroomCollisionArray;

  const initializeMainCollisions = useCallback(() => {
    collisionRef.current = new Collision(collisionArrayData, 1025);
  }, [collisionRef]);

  const initializeRoomCollisions = useCallback(() => {
    if (RoomMapRef.current) {
      const tileValue = 555;
      RoomCollisionsRef.current = new RoomCollision(roomCollisionsDataArray, tileValue, RoomMapRef.current);
    }
  }, [RoomCollisionsRef, RoomMapRef]);

  return {
    collisionArrayData,
    roomCollisionsDataArray,
    initializeMainCollisions,
    initializeRoomCollisions,
  };
}
