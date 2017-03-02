// exports
module.exports = {
    JoinRoom:  joinRoom,
    ExitRoom:  exitRoom,
    ChangeRule:changeRule,

    StartGame: startGame,
};

// imports
night = require("./night")
role = require("../role")

// join room
function joinRoom(io, socket, village){
    return function(data){
        village.addUser(data.userId, socket.id, data.name);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
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
        for(var [userId,user] of village.users){
            io.to(user.socketId).emit("toleAck", user.role.type);

            if(userRole.chatType == role.common.chatType.PERSONAL){
                io.sockets.sockets[user.socketId].join(userId);
                io.to(userId).emit("debug", userId + "はぼっち村の人です");
            } else if(user.role.chatType == role.common.chatType.GROUP){
                io.sockets.sockets[user.socketId].join(user.role.chatGroup);
                io.to(user.role.chatGroup).emit("debug", "あなたは" + user.role.type + "です");
            }
        }

        // next phase
        night.Begin(io, village);
    }
};
