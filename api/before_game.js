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
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,id)=>{
                            ret.push({
                                id   : id,
                                name : village.users[id].name,
                            });
                            return ret;
                        }, []));
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // list of {id,name}
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,id)=>{
                            ret.push({
                                id   : id,
                                name : village.users[id].name,
                            });
                            return ret;
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
            if(userRole.chatType == role.common.chatType.PERSONAL){
                io.sockets.sockets[userSocketId].join(userId);
                io.to(userId).emit("debug", userId + "はぼっち村の人です");
            } else {
                io.sockets.sockets[userSocketId].join(userRole.chatGroup);
                io.to(userRole.chatGroup).emit("debug", "あなたは" + userRole + "です");
            }
        }

        // next phase
        night.Begin(io, village);
    }
};
