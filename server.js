var server = require('http').createServer(doReq);
var io = require('socket.io')(server);

server.listen(3000) // connect


// socket
var bg = require('./api/before_game')

/* // memo
  var room = io.of('roomName'); // make namespace
  socket.join('roomName') // join room
  socket.leave('roomName') // leave
  io.to('roomName').emit(~~)

  io.to(socket.id).emit(~~)
*/

io.on('connection', function(socket) {
    io.emit('connectionEstablished', {}) // 通知
    socket.on('disconnection', function(){})

    // before game
    socket.on('joinRoom',   bg.JoinRoom(io, socket.id));
    socket.on('exitRoom',   bg.ExitRoom(io));
    socket.on('changeRule', bg.ChangeRule(io));
    socket.on('startGame',  bg.StartGame(io));

    // morning
    // afternoon
    // evening
    // night
});

console.log('Server running!');

// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
