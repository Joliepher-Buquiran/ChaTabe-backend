import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';



import connectDB from './config/db.js'
import userRoute from './route/userRoute.js'
import adminRoute from './route/adminRoute.js'

dotenv.config()

const app = express();
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",
  "https://cha-tabe-frontend-59wa.vercel.app",
];


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(200); // respond to preflight immediately
  next();
});


const PORT = process.env.PORT || 3000;

connectDB();
console.log()

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin: ['http://localhost:5173',"https://cha-tabe-frontend-59wa.vercel.app"],
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true

  }
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join conversation room
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined room:", conversationId);
  });

  // receive message from frontend
 // receive message from frontend
socket.on("sendMessage", (data) => {
  const { conversationId, message } = data;
  const convId = String(conversationId);

  // emit to room (everyone who joined)
  io.to(convId).emit("receiveMessage", message);

  // also emit directly to the sender socket to guarantee they get it
  // (covers the case where sender hasn't joined room yet due to race)
  socket.emit("receiveMessage", message);
});


   socket.on("typing", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("typing", { senderId });
  });

  // When a user stops typing...
  socket.on("stopTyping", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("stopTyping", { senderId });
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


app.use("/uploads", express.static("uploads"));

app.use('/',userRoute);
app.use('/admin', adminRoute);  

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
