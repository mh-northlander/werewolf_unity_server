"use strict";

// imports
const before_game = require("./before_game");
const after_game  = require("./after_game");

const night     = require("./night");
const morning   = require("./morning");
const daytime   = require("./daytime");
const afternoon = require("./afternoon");
const evening   = require("./evening");

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

const util = require("../util")
const village = require('../village/');
const vil = village.Village(util.randomString(32));
const gamePhases = village.Phase.GamePhase

module.exports.mountAPIs = function(io){
    io.on("connection", function(socket){
        socket.on('disconnection', function(){}); // TODO: reconnection

        // common
        socket.emit('connectionEstablished', {}); // TODO: reconnection

        // before game
        socket.on('joinRoom',   before_game.JoinRoom(io,socket, vil));
        socket.on('exitRoom',   before_game.ExitRoom(io,socket, vil));
        socket.on('changeName', before_game.ChangeName(io,socket, vil));
        socket.on('changeRule', before_game.ChangeRule(io,socket, vil));
        socket.on('startGame',  before_game.StartGame(io,socket, vil));

        // phase shift
        socket.on("morningResultChecked", morning.MorningResultChecked(io,socket, vil));
        socket.on("finishDiscussion",     daytime.FinishDiscussion(io,socket, vil));
        socket.on("eveningResultChecked", evening.EveningResultChecked(io,socket, vil));

        // vote
        socket.on('vote', afternoon.Vote(io,socket, vil));

        // chat
        socket.on('chat', night.Chat(io,socket, vil));

        // action
        socket.on('action', night.Action(io,socket, vil));

        // debug
        socket.on("endNight", night.EndNight(io,socket,vil));
    });
}
