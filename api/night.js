module.exports = {
    Action: action,
    Chat: chat,

    Begin: begin,
    End  : end,
};

// import
shared = require("./shared");
morning = require("./morning");
GamePhaseNight = require('../village/phase').GamePhase.NIGHT;

//// listen
// action
function action(io, socket, village){
    return function(act){
        userId = village.socketIdToUserId(socket.id);
        user = village.users[userId];

        resp = user.role.evalActionNight(village, userId, act);
        if(resp && !resp=={}){
            io.to(village.users[userId].chatRoom).emit("actionResult", resp);
        }
    };
};

// chat
function chat(io, socket, village){
    return function(message){
        // TODO
        // socket.to(chatRoom).emit();
    };
};


//// emit
// begin
function begin(io, village){
    console.log("night b");
    // shift
    phase = village.shiftPhase(GamePhaseNight);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // reset
    village.actionStack = {};

    // action candidates
    candidatesMap = village.getCandidatesMap()
    for(userId in candidatesMap){
        io.to(village.userIdToSocketId(userId)).emit(
            "actionCandidates", candidatesMap[userId]);
    }

    // action result (for difinite action)
    resultMap = village.getResultMap()
    for(userId in resultMap){
        io.to(village.userIdToSocketId(userId)).emit(
            "actionResult", resultMap[userId]);
    }

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => {
        end(io, village);
    }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("night e");
    // TODO 未決定行動のランダム決定
    morning.Begin(io, village);
};
