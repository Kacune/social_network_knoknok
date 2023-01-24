let app = require('express')();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
let http = require('http').Server(app);
let io = require('socket.io')(http,{
    cors: {
    origin: "http://localhost:8080",
    credentials: true
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
http.listen(4000, () => {
    console.log('Listening on port *: 4000');
});


io.on('connection', (socket) => {
  socket.on('joined', ({username, roomId}) => {
    console.log(username, roomId);
    socket.join(roomId);
    socket.to(roomId).emit('joined', username);
    socket.to(roomId).emit('connections', 1);
  });

  socket.on('chat-message', (data) => {
    socket.to(data.roomId).emit('chat-message', data);
    console.log(data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('typing', data);
  });

  socket.on('stopTyping', (roomId) =>{
    socket.to(roomId).emit('stopTyping', false);
  });
  socket.on('create-suggestion', ({suggestion}) => {
    socket.emit('create-suggetsion', suggestion);
  });
  socket.on('add-photo', (data) => {
    socket.emit('add-photo', data);
  });
  socket.on('delete-favorite', (data) => {
    socket.emit('delete-favorite', data);
  });
  socket.on('add-favorite', (data) => {
    socket.emit('add-favorite', data);
  });
});
