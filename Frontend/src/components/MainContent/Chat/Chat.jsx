import { useEffect, useState, useContext, useRef } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import io from 'socket.io-client'

const Chat = () => {
  const { profile } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      withCredentials: true,
      reconnectionAttempts: 5, // Limit the number of reconnection attempts
      timeout: 10000 // Set timeout for the connection
    })

    // Emit user connection event
    if (profile) {
      socketRef.current.emit('userConnect', { user: profile.first_name + ' ' + profile.last_name })
    }

    // Receive messages from server
    socketRef.current.on('messagesLogs', (data) => {
      setMessages(data)
    })

    // Listen for new user notification
    socketRef.current.on('newUser', (data) => {
      console.log('New user connected:', data)
    })

    // Handle connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    socketRef.current.on('connect_timeout', () => {
      console.error('Connection timeout')
    })

    socketRef.current.on('reconnect_attempt', (attempt) => {
      console.log('Reconnection attempt:', attempt)
    })

    socketRef.current.on('reconnect_failed', () => {
      console.error('Reconnection failed')
    })

    // Clean up socket connection on component unmount
    return () => {
      socketRef.current.disconnect()
    }
  }, [profile])

  const sendMessage = () => {
    if (socketRef.current && profile) {
      socketRef.current.emit('message', { user: `${profile.first_name} ${profile.last_name}`, message: newMessage })
      setNewMessage('')
    }
  }

  return (
        <div className="flex flex-column max-h-[70vh] w-full gap-2 p-2">
            <h1 className='text-center rounded-md border-1 border-[#30363d] bg-[#21262d] p-3 text-sm text-white w-5/6 self-center'>¡Hola! Bienvenido al chat Premium.</h1>

            <ul className='grow overflow-y-scroll w-full self-center sm:w-5/6'>
              {messages.map((msg, index) => {
                return msg.user === profile.first_name + ' ' + profile.last_name
                  ? (
                    <div className='flex w-full justify-end'>
                      <li className='flex flex-col max-w-[66%] my-1 break-words rounded border-1 border-[#30363d] bg-[#21262d] py-1 px-2 text-sm text-white text-right' key={index}>
                        <strong className='text-lime-500'>{msg.user}</strong>
                        <p>{msg.message}</p>
                      </li>
                    </div>
                    )
                  : (
                    <div className='flex w-full justify-start'>
                      <li className='flex flex-col max-w-[66%] my-1 break-words rounded border-1 border-[#30363d] bg-[#21262d] py-1 px-2 text-sm text-white text-left' key={index}>
                        <strong className='text-red-500'>{msg.user}</strong>
                        <p>{msg.message}</p>
                      </li>
                    </div>
                    )
              })}
            </ul>

            <div className='w-5/6 flex flex-row justify-end rounded-md border-1 border-[#30363d] bg-[#21262d] p-2 gap-3 text-sm text-white lg:w-1/4 self-center'>
                <input
                    className='w-full rounded-md text-black'
                    type="text"
                    placeholder="Enter a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="rounded-md border-1 border-[#30363d] bg-[#3e4855] p-1 text-sm w-2/6 text-center" onClick={sendMessage}>Send</button>
            </div>
        </div>
  )
}

export default Chat
