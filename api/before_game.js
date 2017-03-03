// exports
module.exports = {
    JoinRoom : joinRoom,
    ExitRoom : exitRoom,

    ChangeRule    : changeRule,
    ChangeRoleSet : changeRoleSet,

    StartGame : startGame,
};

// imports
rule = require("../village/rule");
role = require("../role")
night = require("./night")

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
        village.updateRule(rule);
        io.sockets.emit('ruleChanged', village.Rule.toJSON());
    }
};

function changeRoleSet(io, socket, village){
    return function(roleObj){
        village.updateRoleSet(rule.JSONToRoleMap(roleObj));
        io.sockets.emit("ruleChanged", village.Rule.toJSON());
    }
};

// start game
function startGame(io, village){
    return function(){
        // set role
        roleList = village.rule.suffledRoleList();
        idx = 0;
        for(let [userId,user] of village.users){
            user.role = role[roleList[idx]]();
            io.to(user.socketId).emit("roleAck", user.role.type);

            idx++;
        }

        // set chat room
        for(let [userId,user] of village.users){
            if(user.role.chatType == role.common.chatType.PERSONAL){
                user.chatRoom = userId;
                io.sockets.sockets[user.socketId].join(user.chatRoom);

                io.to(user.chatRoom).emit("debug", userId + "はぼっち村の人です");
            } else if(user.role.chatType == role.common.chatType.GROUP){
                user.chatRoom = user.role.chatGroup;
                io.sockets.sockets[user.socketId].join(user.chatRoom);

                io.to(user.chatRoom).emit("debug", "あなたは" + user.role.type + "です");
            }
        }

        // next phase
        night.Begin(io, village);
    }
};
