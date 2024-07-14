import express from 'express'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'


const app=express()
const server=http.createServer(app)
const io=new Server(server)
const PORT=3000

const __dirname=path.resolve();

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

io.on('connection',(socket)=>{
    console.log(`user with ID: ${socket.id} has been connected`)
    socket.on('sendLocation',(data)=>{
        console.log(data)
        io.emit('recievedLocation',{id:socket.id,...data})
        
    })
   socket.on('disconnect',()=>{
    console.log(`User with ID ${socket.id} has been disconnected`)
    io.emit('userDisconnected',{id:socket.id})
   })
})

app.get('/',(req,res)=>{
    res.render('index')
    
})

server.listen(PORT,()=>console.log(`the server is running on PORT: ${PORT}`))