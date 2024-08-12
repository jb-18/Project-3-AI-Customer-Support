'use client'
import Image from 'next/image'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm C.H.A.T.A, the support assistant for Flip-Punch Industries. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('') 
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message }, 
      { role: 'assistant', content: '' }, 
    ])

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader() 
      const decoder = new TextDecoder() 

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1) 
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }, 
          ]
        })
        return reader.read().then(processText)  
      })
    })
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className="matrix-rain" // Add this class
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="2px solid rgba(255, 255, 255, 0.7)" // Border with neon effect
        p={2}
        spacing={3}
        bgcolor="rgba(0, 0, 0, 0.6)" // Semi-transparent background
        borderRadius={16} // Rounded corners
        className="neon-border" // Neon effect class
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
                className="neon-border" // Neon effect for text boxes
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="neon-border" // Neon effect for the input field
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
      <style jsx global>{`
        /* Matrix rain background animation */
        .matrix-rain {
          position: relative;
          overflow: hidden;
          background-color: black;
        }

        .matrix-rain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 0, 0.2) 0%,
            rgba(0, 255, 0, 0.2) 20%,
            transparent 20%,
            transparent 100%
          );
          background-size: 1px 100px;
          animation: matrix-animation 3s infinite linear; /* Slower animation */
        }

        @keyframes matrix-animation {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        /* Neon border effect */
        .neon-border {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.6),
                      0 0 10px rgba(255, 255, 255, 0.6),
                      0 0 20px rgba(255, 255, 255, 0.6),
                      0 0 40px rgba(255, 255, 255, 0.6),
                      0 0 80px rgba(255, 255, 255, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.7); /* Optional if you want a solid border with neon */
        }

        /* Neon effect for input field (TextField) */
        .neon-border .MuiInputBase-root {
          color: white; /* White text color */
          background: rgba(0, 0, 0, 0.3); /* Semi-transparent background */
        }

        /* Additional styles for buttons */
        .MuiButton-contained {
          background: rgba(255, 255, 255, 0.8); /* Button background */
          color: black; /* Button text color */
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.6),
                      0 0 10px rgba(255, 255, 255, 0.6),
                      0 0 20px rgba(255, 255, 255, 0.6),
                      0 0 40px rgba(255, 255, 255, 0.6),
                      0 0 80px rgba(255, 255, 255, 0.6);
        }

        .MuiButton-contained:hover {
          background: rgba(255, 255, 255, 1); /* Brighter on hover */
        }
      `}</style>
    </Box>
  )
}
