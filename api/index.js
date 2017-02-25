// imports
before_game = require("./before_game");
after_game  = require("./after_game");

night     = require("./night");
// morning   = require("./morning");
// daytime   = require("./daytime");
afternoon = require("./afternoon");
// evening   = require("./evening");

shared = require("./shared");

/* // memo io
   io = require("socket.io")()               // io: Server
   io.on("connection", function(soc){ ~~ }); // soc: Socket

   var hoge = io.of('roomName'); // make namespace (something like ./hoge/fuga)

   soc.join('roomName')  // join room
   soc.leave('roomName') // leave

   soc.id // identifier of client

   io.emit() == io.sockets.emit() // all w/ self
   io.to('roomName').emit()       // in room w/ self
   io.to(socket.id).emit()        // one
   soc.emit()                     // a client
   soc.to("roomName").emit()      // in room w/o self
   soc.broadcast.emit()           // all w/o self
*/

util = require("../util")
var village = require('../village/');
var vil = village.Village(util.randomString(32));

module.exports.mountAPIs = function(io){
    io.on("connection", function(socket){
        socket.on('disconnection', function(){});

        // common
        socket.emit('connectionEstablished', {});
        socket.on('readyToShift', shared.ReadyToShift(io,socket, vil))

        // before game
        socket.on('joinRoom',   before_game.JoinRoom(io,socket, vil));
        socket.on('exitRoom',   before_game.ExitRoom(io,socket, vil));
        socket.on('changeRule', before_game.ChangeRule(io,socket, vil));
        socket.on('startGame',  before_game.StartGame(io, vil));

        // afternoon
        socket.on('vote', afternoon.Vote(io,socket, vil))

        // night
        socket.on('chat',   night.Chat(io,socket, vil))
        socket.on('action', night.Action(io,socket, vil))
    });
}
