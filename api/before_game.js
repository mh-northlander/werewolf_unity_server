// exports
module.exports = {
    JoinRoom:  joinRoom,
    ExitRoom:  exitRoom,
    ChangeRule:changeRule,

    StartGame: startGame,
};

// imports
night = require("./night")

// join room
function joinRoom(io, socket, village){
    return function(data){
        village.addUser(data.userId, socket.id, data.name);

        // user name list
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,key)=>{
                            ret.push(village.users[key].name);
                            return ret
                        }, []));
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // user name list
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,key)=>{
                            ret.push(village.users[key].name);
                            return ret
                        }, []));
    }
};

// change rule
function changeRule(io, socket, village){
    return function(rule){
        village.changeRule(rule);
        io.sockets.emit('ruleChanged', village.Rule);
    }
};

// start game
function startGame(io, village){
    return function(){
        // set role : TODO
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('roleAck', userRole.type);
        }

        // set chat room : TODO

        // next phase
        night.Begin(io, village);
    }
};
