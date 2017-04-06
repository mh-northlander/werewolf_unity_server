"use strict";

// export
module.exports = {
    Action: action,
    Chat: chat,

    EndNight : endNight,

    Begin: begin,
    End  : end,
};

// import
const morning = require("./morning");
const GamePhaseNight = require('../village/phase').GamePhase.NIGHT;
const util = require("../util");


// action
function action(io, socket, village){
    return function(act){
        if(phaseCheck(io, socket, village, "action")){
            const userId = village.socketIdToUserId(socket.id);
            const user = village.users.get(userId);

            console.log("act of " + user.name + ":");
            console.log(act);

            const resp = user.role.evalActionNight(village, userId, act);
            if(!util.isEmptyObj(resp)){
                io.to(village.users.get(userId).chatRoom).emit("actionResult", resp);
            }
        }
    };
};

// chat
function chat(io, socket, village){
    return function(data){
        if(phaseCheck(io, socket, village, "chat")){
            // TODO
            const userId = village.socketIdToUserId(socket.id);
            io.to(village.users.get(userId).chatRoom).emit(
                "chat", { userId: userId, message: data.message });
        }
    };
};

// end night (for debug)
function endNight(io, socket, village){
    return function(){
        if(phaseCheck(io, socket, village, "endNight")){
            clearTimeout(timeOutId);
            end(io, village);
        }
    };
}

// begin
let timeOutId;
function begin(io, village){
    console.log("night begin");
    // shift
    const phase = village.shiftPhase(GamePhaseNight);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    console.log("action cands");
    // action candidates
    const candidatesMap = village.getCandidatesMap();
    for(const [id, list] of candidatesMap){
        if(list.length > 0){
            io.to(village.userIdToSocketId(id)).emit("actionCandidates", list);
        }
    }

    console.log("action res");
    // action result (for difinite action)
    const resultMap = village.getResultMap();
    for(const [id, res] of resultMap){
        if(!util.isEmptyObj(res)){
            io.to(village.userIdToSocketId(id)).emit("actionResult", res);
        }
    }

    // timer
    console.log("start count: " + phase.secCount + " sec");
    timeOutId = setTimeout(() => { end(io, village); }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("night end");
    // TODO 未決定行動のランダム決定
    morning.Begin(io, village);
};

// validation
function phaseCheck(io, socket, village, eventName){
    if(village.phase.gamePhase === GamePhaseNight){
        return true
    } else {
        console.log("badRequest:", eventName, "can't call at", village.phase.gamePhase, "by", village.socketIdToUserId(socket.id));
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest: "+eventName+" can't call at "+ village.phase.gamePhase})
        return false
    }
}
