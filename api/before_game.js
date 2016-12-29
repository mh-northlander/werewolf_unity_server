// requires
model = require('./../model')

// exports
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
}


// join room
function joinRoom(io, socketId){
    return function(data){
        room.addUser(data.userId, new model.User(data.name, socketId));
        io.emit('joinRoom', {value : room.getUserNameList()});
    }
}

// exit room
function exitRoom(io){
    return function(data){
        io.emit('exitRoom', {value : "fuga"});
    }
}

// change rule
function changeRule(io){
    return function(data){
        io.emit('changeRule', {value : "piyo"});
    }
}

// start game
function startGame(io){
    return function(data){
        io.emit('startGame', {value : "pohe"});
    }
}

//// vars
var room = new model.Room(0);

// userInfoMap
var userInfoMap = {};
