const express=require("express");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes.js"); 
const messageRoutes=require("./routes/messageRoutes.js"); 
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");


const app=express();
app.use(express.json());  //accept json data
dotenv.config();
connectDB();

app.use('/api/user',userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);


app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT||5000

const server=app.listen(5000,console.log(`Server started on PORT ${PORT}`));

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket)=>{
    console.log('connected to socket.io');
  
    socket.on('setup',(userData)=>{
       socket.join(userData._id);           //creating room for that particular user only
       socket.emit('connected');
    });
  
    //joining the chat
    socket.on('join chat',(room)=>{
       socket.join(room);
       console.log("User Joined Room: "+room);
    });
  
    socket.on("typing",(room)=>socket.in(room).emit("typing"));

    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));
  
    socket.on('new message',(newMessageReceived)=>{
      var chat=newMessageReceived.chat;
  
      if (!chat.users) {
          return console.log("chat.users not defined");
      }
  
      //we want our message to emit to all the other user except me in a room/group
      chat.users.forEach(user=>{
          if (user._id==newMessageReceived.sender._id) {
              return;
          }
  
          socket.in(user._id).emit("message received",newMessageReceived);
      });
    });
  
    socket.off("setup",()=>{
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
