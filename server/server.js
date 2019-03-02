const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var port = process.env.PORT || 3250;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
          console.log('New user connected');

          socket.on('disconnect', ()=>{
            console.log('User was disconnected');
            var user = users.removeUser(socket.id);
            if(user) {
              io.to(user.room).emit('updateUsersList',users.getUserList(user.room));
              io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room!`));
            }
          });
// EMAIL RELATED EVENTS - newEmail, createEmail
          // socket.emit('newEmail', {
          //   from:'leelart@example.com',
          //   subject:'HRU?',
          //   body: 'long time no chat! Wats up?'
          // });
          //
          // socket.on('createEmail', (emailData) => {
          //   console.log('EmailData: ',emailData)
          // });

//REMOVE EMIT CALLS FROM BOTH SERVER.JS AND INDEX.JS - server.js - DONE
          // socket.emit('newMessage', {
          //   from: 'Leela',
          //   text: 'hi',
          //   sentAt: '1:45pm'
          // });

          socket.on('join', (params, callback) => {
            // console.log(JSON.stringify(params, undefined,2));
            if (!isRealString(params.userName) || !isRealString(params.roomName))
            {
              return callback('User name and Room name are required!');
            }
            socket.join(params.roomName)

            users.removeUser(socket.id); //rmoves the user if the user is previously connected on any room
            users.addUser(socket.id, params.userName, params.roomName); //Add the user to the room
            io.to(params.roomName).emit('updateUsersList', users.getUserList(params.roomName));
            //Message is sent only to the logged in user
            socket.emit('newMessage',generateMessage('Admin', 'Welcome to Chat application!'));
            //Message is sent to all the users available in the room
            socket.broadcast.to(params.roomName).emit('newMessage',generateMessage('Admin',`${params.userName} has joined!`));
            callback();
          });

          socket.on('createMessage', (msg, callback) => {
                console.log('createMessage: ', msg);
                var user = users.getUser(socket.id);
                // io.emit SENDS MESSAGE TO EVERY ONE INCLUDING THE SENDER
                if(user && isRealString(msg.text)){
                  io.to(user.room).emit('newMessage',generateMessage(user.name, msg.text));
                }

                // callback('This is from SERVER');
                callback();
// socket.broadcast.emit SENDS MESSAGE TO EVERY ONE EXCEPT THE SENDER
                // socket.broadcast.emit('newMessage',{
                //   from: msg.from,
                //   text: msg.text,
                //   createdAt: new Date().getTime()
                // });

          });

          socket.on('createLocationMessage', (coords) => {
            var user = users.getUser(socket.id);
            if(user){
              // io.emit('newMessage', generateMessage('Admin', `Latitude: ${coords.latitude} and Longitude: ${coords.longitude}`));
              io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            }

          });
});

server.listen(port, ()=>{
  console.log(`Server is up and running on ${port}`);
});
