const express = require('express');
const moment = require('moment');
const {userJoin, userLeave, getRoomUsers} = require('./public/user')
const app = express()
const http = require('http').createServer(app);
const time = moment().format('h:mm a');

const PORT = process.env.PORT || 5000

http.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) =>{
    // res.send("Hello Satish")
    res.sendFile(__dirname + '/home.html');
})

// Node server which will handle socket io connections
const io = require('socket.io')(http)

const users = {};

io.on('connection', (socket) =>{
    console.log('Connected...');

    socket.on('current-time', time =>{
        socket.emit('presentTime', time);
    })

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // If any new user joins, let other users connected to the server know!
        socket.on('new-user-joined', name =>{ 
            users[socket.id] = name;
            socket.broadcast.to(user.room).emit('user-joined', name);        
            socket.emit('all-joined-users', name);
        });    

        // If someone sends a message, broadcast it to other people
        socket.on('send', message =>{
            // const name = getCurrentUser(socket.id);
            socket.broadcast.to(user.room).emit('receive', {message: message, name: users[socket.id], time: time})   
        });

        // If someone leaves the chat, let others know 
        socket.on('disconnect', message =>{
            const user = userLeave(socket.id);
            if(socket.broadcast.to(user.room).emit('left', users[socket.id])){
                delete users[socket.id];
            }
    
            // Send users and room info
            if(user){
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });

    })


})

