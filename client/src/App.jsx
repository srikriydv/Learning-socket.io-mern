import { io } from "socket.io-client";
import { Container, Box, Stack, Button, TextField, Typography } from "@mui/material";
import { useState, useMemo, useEffect } from "react";

function App() {
  const [socketId, setSocketId] = useState("");
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", ({room, message}));
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("recieve-message", (data)=>{
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="lg" align="center" sx={{ m: 5 }}>
      <Container sx={{ width: "75%" }}>
        <Button fullWidth variant="outlined" size="large" color="secondary">
          UserID: {socketId}
        </Button>
        <Stack direction="row" component="form" onSubmit={joinRoomHandler}>
          <TextField
            value={roomName}
            onChange={(e) => { setRoomName(e.target.value) }}
            label="Room Name"
            margin="dense"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            size="medium"
            variant="contained"
            sx={{ m: "auto" }}
            color="secondary"
          >
            Join
          </Button>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Message"
            margin="dense"
            variant="outlined"
            fullWidth
          />
          <TextField value={room} onChange={(e) => { setRoom(e.target.value) }} label="Room" margin="dense" variant="outlined" fullWidth />
          <Button
            size="large"
            variant="contained"
            fullWidth
            color="secondary"
            sx={{ mt: 1 }}
            type="submit"
          >
            Send
          </Button>
        </Box>
      {
        messages.map((message, index)=>{
          return <Button key={index} variant="contained" fullWidth sx={{ mt: 1 }}>{message}</Button>
        })
      }
      </Container>
    </Container>
  );
}

export default App;
