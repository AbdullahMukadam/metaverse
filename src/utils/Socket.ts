import { IncomingAudioData } from "@/components/VoiceChat/Voicechat";
import { config } from "dotenv";
import { io, Socket } from "socket.io-client";

config({ path: ".env" });
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
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL as string)
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
    onUserLeft: (data: LeftUserData) => void,
    onHouseUserJoined: (user: UsersData) => void,
    onHouseUserMoved: (data: RemoteUserData) => void
): void => {
    const socket = initializeSocket();

    socket.on("UserJoined", onUserJoined);
    socket.on("UserMoved", onUserMoved);
    socket.on("UserLeft", onUserLeft);
    socket.on("HouseUserJoined", onHouseUserJoined);
    socket.on("HouseUserMoved", onHouseUserMoved);
};

export const removeSocketListeners = () => {
    const socket = initializeSocket();
    socket.off("UserJoined");
    socket.off("UserMoved");
    socket.off("UserLeft");
    socket.off("HouseUserJoined");
    socket.off("HouseUserMoved");
  };

export const IncomingAudioListener = (
    handleIncomingAudio: (data: IncomingAudioData) => void
): void => {
    const socket = initializeSocket();

    socket.on("incomingAudio", handleIncomingAudio);
}


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

export const sendHouseMovementUpdate = (data: UserMovementData) => {
    const socket = initializeSocket();
    socket.emit("UpdateHousePosition", data);
};

export const handleUserEnteredRoom = (
    id: string | undefined,
    name: string | undefined,
    positions: { X: number; Y: number },
    selectedCharacter: string
): Promise<UsersData[] | false> => {
    return new Promise((resolve) => {
        const socket = initializeSocket()
        socket.emit("enteredHouseRoom", {
            userId: id,
            UserName: name,
            positions,
            selectedCharacter
        })

        socket.on("HouseRoomJoined", (data: SpaceJoinedResponse) => {
            resolve(data.UsersArr.length > 0 ? data.UsersArr : false);
        });

        socket.on("connect_error", () => {
            resolve(false);
        });
    })
}

export const getSocket = (): Socket => {
    return initializeSocket();
};