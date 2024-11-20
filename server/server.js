import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("message", ({room, message}) => {
        console.log({room, message});
        socket.to(room).emit("recieve-message", message);

    socket.on("join-room", (room) => {
        socket.join(room);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
    });
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});