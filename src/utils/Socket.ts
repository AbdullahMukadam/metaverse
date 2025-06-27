import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export interface UsersData {
    userId: string;
    UserName: string;
    socketId: string;
    positions: {
        X: number;
        Y: number;
    };
    selectedCharacter: string;
}

interface SpaceJoinedResponse {
    UsersArr: UsersData[];
}

export interface UserMovementData {
    positions: {
        X: number;
        Y: number;
    };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
}

export interface RemoteUserData extends UserMovementData {
    userId: string;
    UserName: string;
    socketId: string;
    selectedCharacter: string;
}

export const initializeSocket = (): Socket => {
    if (!socket) {
        socket = io("http://localhost:8000", {
            reconnectionAttempts: 0,
            reconnectionDelay: 1000,
            autoConnect: false
        });

        socket.connect();
    }
    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const handleSpaceCreation = (
    id: string | undefined,
    name: string | undefined,
    positions: { X: number; Y: number },
    selectedCharacter: string
): Promise<UsersData[] | false> => {
    return new Promise((resolve) => {
        const socket = initializeSocket();

        socket.emit("JoinSpace", {
            userId: id,
            UserName: name,
            positions,
            selectedCharacter
        });

        socket.on("SpaceJoined", (data: SpaceJoinedResponse) => {
            resolve(data.UsersArr.length > 0 ? data.UsersArr : false);
        });

        socket.on("connect_error", () => {
            resolve(false);
        });
    });
};

export interface LeftUserData {
    userId: string,
    socketId: string
}

export const setupSocketListeners = (
    onUserJoined: (user: UsersData) => void,
    onUserMoved: (data: RemoteUserData) => void,
    onUserLeft: (data: LeftUserData) => void
): void => {
    const socket = initializeSocket();

    socket.on("UserJoined", onUserJoined);
    socket.on("UserMoved", onUserMoved);
    socket.on("UserLeft", onUserLeft);
};


export const sendMovementUpdate = (data: UserMovementData) => {
    const socket = initializeSocket();
    socket.emit("UpdatePosition", data);
};

export const handleUserLeave = (userId: string) => {
    const socket = initializeSocket()
    socket.emit("disconnection", {
        userId
    })
}

export const getSocket = (): Socket => {
    return initializeSocket();
};