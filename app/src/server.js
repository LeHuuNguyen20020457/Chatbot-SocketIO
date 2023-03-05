const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const {Server} = require("socket.io");
const Filter = require('bad-words');
const {getUserList, addNewUser, getRemoteUserList} = require('./utils/users')


const {createMessages} = require('./utils/create-messages.js')

const PORT = 3000 || process.env.PORT

const server = http.createServer(app)
const io = new Server(server);

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))




//client kết nối với server
io.on('connection', (socket) => {
  console.log('a user connected') 

  socket.on('join room from client to server', ({room, username}) => {
    // cho người dùng vào đúng phòng của họ
    socket.join(room)

    socket.emit('send message from server to client', createMessages(`Chào mừng bạn đến với phòng ${room}`))
    socket.broadcast.to(room).emit('send message from server to client', createMessages(`${username} vừa tham gia chat`))
    var filter = new Filter(); 

    //gửi vị trí
    socket.on('send location from client to server', function({latitude,longitude}) {
      const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
      io.to(room).emit('send location from server to client', linkLocation)
    })

    // xử lý từ tục tiểu và gửi messagesText về client
    socket.on('send message from client to server', function(messageText, callback) {   
        if(filter.isProfane(messageText)){
         return callback('có chứa từ không hợp lệ')
        }
          io.to(room).emit('send message from server to client', createMessages(messageText))
          callback('gủi tin nhắn thành công')
    })


    const newUser = {
      id: socket.id,
      room,
      username
    }
    addNewUser(newUser)

    // danh sách các user trong phòng
    io.to(room).emit('send user list from server to client', getUserList(room)) 
  
    socket.on('disconnect', () => {
      
      console.log('user disconnected')
      getRemoteUserList(socket.id)
      io.to(room).emit('send user list from server to client', getUserList(room))
    })
  })

}) 

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})