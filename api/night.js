module.exports = {
    Action: action,
    Chat: chat,

    Begin: begin,
    End  : end,
};

// import
const morning = require("./morning");
const GamePhaseNight = require('../village/phase').GamePhase.NIGHT;

//// listen
// action
function action(io, socket, village){
    return function(act){
        const userId = village.socketIdToUserId(socket.id);
        const user = village.users.get(userId);

        const resp = user.role.evalActionNight(village, userId, act);
        if(resp && resp !== {}){
            io.to(village.users.get(userId).chatRoom).emit("actionResult", resp);
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
    console.log("night begin");
    // shift
    const phase = village.shiftPhase(GamePhaseNight);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // action candidates
    const candidatesMap = village.getCandidatesMap();
    console.log(candidatesMap);
    for(const [id, list] of candidatesMap){
        io.to(village.userIdToSocketId(id)).emit("actionCandidates", list);
    }

    // action result (for difinite action)
    const resultMap = village.getResultMap();
    console.log(resultMap);
    for(const [id, res] of resultMap){
        io.to(village.userIdToSocketId(id)).emit("actionResult", res);
    }

    // timer
    console.log("start count: " + phase.secCount + " sec");
    setTimeout(() => { end(io, village); }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("night end");
    // TODO 未決定行動のランダム決定
    morning.Begin(io, village);
};
