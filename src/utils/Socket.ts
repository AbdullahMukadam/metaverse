import { io, Socket } from "socket.io-client"

let socket: Socket | null

const initializeSocket = () => {
    if (!socket) {
        socket = io("http://localhost:8000")
        //console.log(socket.id)
    }
    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

export const handleSpaceCreation = (id: string | undefined, name: string | undefined): Promise<string> => {
    return new Promise((resolve) => {
        const socket = initializeSocket()
        //console.log(socket.id)
        socket.emit("JoinSpace", {
            userId: id,
            UserName: name
        })

        socket.once("SpaceJoined", (data) => {
            const { socketId } = data
            if (socketId) {
                resolve("success")
            }

        })
    })
}

export const getSocket = () => {
    return initializeSocket()
}