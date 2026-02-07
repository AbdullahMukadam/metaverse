import { useCallback } from 'react';
import { RemoteUser } from '@/app/game/clases/RemoteUser';
import { UsersData, RemoteUserData, LeftUserData } from '@/utils/Socket';

export function useSocketHandlers(
  remoteUsersRef: React.MutableRefObject<Record<string, RemoteUser>>,
  remoteUsersHouseRef: React.MutableRefObject<Record<string, RemoteUser>>,
  userDataId?: string
) {
  const handleUserJoined = useCallback((newUser: UsersData) => {
    if (newUser.userId !== userDataId) {
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
  }, [remoteUsersRef, userDataId]);

  const handleUserMoved = useCallback((data: RemoteUserData) => {
    const remoteUser = remoteUsersRef.current[data.userId];
    if (remoteUser) {
      remoteUser.updateFromNetwork(data);
    }
  }, [remoteUsersRef]);

  const handleUserLeft = useCallback((data: LeftUserData) => {
    delete remoteUsersRef.current[data.userId];
    delete remoteUsersHouseRef.current[data.userId];
  }, [remoteUsersRef, remoteUsersHouseRef]);

  const handleUserLeaveHouse = useCallback((data: { userId: string }) => {
    delete remoteUsersHouseRef.current[data.userId];
  }, [remoteUsersHouseRef]);

  const handleHouseUserJoined = useCallback((newUser: UsersData) => {
    if (newUser.userId !== userDataId) {
      const remoteUser = new RemoteUser(
        newUser.positions.X,
        newUser.positions.Y,
        newUser.selectedCharacter,
        newUser.userId,
        newUser.UserName
      );
      remoteUser.load().then(() => {
        remoteUsersHouseRef.current[newUser.userId] = remoteUser;
      });
    }
  }, [remoteUsersHouseRef, userDataId]);

  const handleHouseUserMoved = useCallback((data: RemoteUserData) => {
    const remoteUser = remoteUsersHouseRef.current[data.userId];
    if (remoteUser) {
      remoteUser.updateFromNetwork(data);
    }
  }, [remoteUsersHouseRef]);

  return {
    handleUserJoined,
    handleUserMoved,
    handleUserLeft,
    handleUserLeaveHouse,
    handleHouseUserJoined,
    handleHouseUserMoved,
  };
}
