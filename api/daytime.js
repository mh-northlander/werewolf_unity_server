"use strict";

// export
module.exports = {
    FinishDiscussion: finishDiscussion,

    Begin: begin,
    End  : end,
};

// import
const GamePhaseDaytime = require('../village/phase').GamePhase.DAYTIME;
const afternoon = require("./afternoon");


// finishDiscussion
function finishDiscussion(io, socket, village){
    return function(){
        if(phaseCheck(io, socket, village, "finishDiscussion")){
            const userId = village.socketIdToUserId(socket.id);
            const user = village.users.get(userId);
            user.readyToShift = true;

            console.log("finish discussion: " + user.name);
            if(village.readyToShift()){
                clearTimeout(timeOutId);
                end(io, village);
            }
        }
    };
};

// begin
let timeOutId;
function begin(io, village){
    console.log("daytime begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseDaytime);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // timer
    console.log("start count: " + phase.secCount);
    timeOutId = setTimeout(() => { end(io, village); }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("daytime end");
    afternoon.Begin(io, village);
};

// validation
function phaseCheck(io, socket, village, eventName){
    if(village.phase.gamePhase === GamePhaseDaytime){
        return true
    } else {
        console.log("badRequest:", eventName, "can't call at", village.phase.gamePhase, "by", village.socketIdToUserId(socket.id));
        // TODO:before_gameだとjoinRoomに対してはユーザーの特定がIDだとできないのでundefinedになる
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest: "+eventName+" can't call at "+ village.phase.gamePhase})
        return false
    }
}
