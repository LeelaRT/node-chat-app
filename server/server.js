const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

var port = process.env.PORT || 3250;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('New user connected');

  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});

server.listen(port, ()=>{
  console.log(`Server is up and running on ${port}`);
});
