import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket: Socket | null = null

export const initializeSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: token || localStorage.getItem('token'),
      },
    })
  }
  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
}
