import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { initializeSocket, disconnectSocket } from '../utils/socket'
import { useAuth } from '../contexts/AuthContext'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const socketInstance = initializeSocket()

      socketInstance.on('connect', () => {
        console.log('Socket connected')
        setConnected(true)
      })

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected')
        setConnected(false)
      })

      socketInstance.on('error', (error) => {
        console.error('Socket error:', error)
      })

      socketInstance.connect()
      setSocket(socketInstance)

      return () => {
        disconnectSocket()
        setSocket(null)
        setConnected(false)
      }
    } else {
      disconnectSocket()
      setSocket(null)
      setConnected(false)
    }
  }, [user])

  const emit = (event: string, data?: any) => {
    if (socket && connected) {
      socket.emit(event, data)
    } else {
      console.warn('Socket not connected. Cannot emit event:', event)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback)
      return () => {
        socket.off(event, callback)
      }
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socket) {
      socket.off(event, callback)
    }
  }

  return {
    socket,
    connected,
    emit,
    on,
    off,
  }
}
