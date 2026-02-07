import { useCallback } from 'react';
import { Character } from '@/app/game/clases/Character';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { UsersData } from '@/utils/Socket';

export function useCharacterManager(
  characterRef: React.RefObject<Character | null>,
  remoteUsersRef: React.RefObject<Record<string, RemoteUser>>,
  remoteUsersHouseRef: React.RefObject<Record<string, RemoteUser>>
) {
  const initRemoteUsers = useCallback(async (users: UsersData[], userDataId?: string) => {
    for (const user of users) {
      if (user.userId !== userDataId) {
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
  }, [remoteUsersRef]);

  const initRemoteUsersHouse = useCallback(async (users: UsersData[], userDataId?: string) => {
    for (const user of users) {
      if (user.userId !== userDataId) {
        const remoteUser = new RemoteUser(
          user.positions.X,
          user.positions.Y,
          user.selectedCharacter,
          user.userId,
          user.UserName
        );
        remoteUsersHouseRef.current[user.userId] = remoteUser;
        await remoteUser.load();
      }
    }
  }, [remoteUsersHouseRef]);

  const updateCharacterDimensions = useCallback((isRoom: boolean) => {
    if (!characterRef.current) return;

    if (isRoom) {
      // Room dimensions
      characterRef.current.width = characterRef.current.selectedCharacter === "Male" ? 24 : 32;
      characterRef.current.height = characterRef.current.selectedCharacter === "Male" ? 30 : 36;
      characterRef.current.speed = 1.4;
    } else {
      // Main world dimensions
      characterRef.current.width = characterRef.current.selectedCharacter === "Male" ? 18 : 20;
      characterRef.current.height = characterRef.current.selectedCharacter === "Male" ? 22 : 25;
      characterRef.current.speed = 1;
    }
  }, [characterRef]);

  const resetCharacterPosition = useCallback((x: number, y: number, isRoom: boolean) => {
    if (!characterRef.current) return;
    
    characterRef.current.worldX = x;
    characterRef.current.worldY = y;
    updateCharacterDimensions(isRoom);
  }, [characterRef, updateCharacterDimensions]);

  return {
    initRemoteUsers,
    initRemoteUsersHouse,
    updateCharacterDimensions,
    resetCharacterPosition,
  };
}
