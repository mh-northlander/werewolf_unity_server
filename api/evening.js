"use strict";

// export
module.exports = {
    EveningResultChecked: eveningResultChecked,

    Begin: begin,
    End  : end,
};

// import
const GamePhaseEvening = require('../village/phase').GamePhase.EVENING;
const night      = require('./night');
const after_game = require('./after_game');


// eveningResultChecked
function eveningResultChecked(io, socket, village){
    return function(){
        if(phaseCheck(io, socket, village, "eveningResultChecked")){
            const userId = village.socketIdToUserId(socket.id);
            const user = village.users.get(userId);
            user.readyToShift = true;

            console.log("evening result checked: " + user.name);
            if(village.readyToShift()){
                end(io, village);
            }
        }
    };
}

// begin
function begin(io, village){
    console.log("evening begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseEvening);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // evening result
    io.sockets.emit("voteResult", village.evalVote());

    if(village.isGameFinished()){
        after_game.Begin(io, village);
    }
};

// end
function end(io, village){
    console.log("evening end");
    night.Begin(io, village);
};

// validation
function phaseCheck(io, socket, village, eventName){
    if(village.phase.gamePhase === GamePhaseEvening){
        return true
    } else {
        console.log("badRequest:", eventName, "can't call at", village.phase.gamePhase, "by", village.socketIdToUserId(socket.id));
        // TODO:before_gameだとjoinRoomに対してはユーザーの特定がIDだとできないのでundefinedになる
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest: "+eventName+" can't call at "+ village.phase.gamePhase})
        return false
    }
}
