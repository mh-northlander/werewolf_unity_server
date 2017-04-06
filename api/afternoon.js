"use strict";

// export
module.exports = {
    Vote : vote,

    Begin: begin,
    End  : end,
};

// imports
const GamePhaseAfternoon = require('../village/phase').GamePhase.AFTERNOON;
const evening = require('./evening');


// vate
function vote(io, socket, village){
    return function(vote){
        if(phaseCheck(io, socket, village, "vote")){
            // vote: [userId]
            console.log(village.users.get(village.socketIdToUserId(socket.id)).name +
                        " votes to " + village.users.get(vote[0]).name);

            const userId = village.socketIdToUserId(socket.id);
            if(!village.users.get(userId).readyToShift){ // prevent multi-vote
                village.addVote(userId, vote);
            }

            // check
            const user = village.users.get(userId);
            user.readyToShift = true;
            if(village.readyToShift()){
                end(io, village);
            }
        }
    };
};

// begin
function begin(io, village){
    console.log("afternoon begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseAfternoon);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // vote candidate
    for(const [id,user] of village.users){
        const candidates = village.voteCandidates(id);
        io.to(village.userIdToSocketId(id)).emit("voteCandidates", candidates);
    }
};

// end
function end(io, village){
    console.log("afternoon end");
    evening.Begin(io, village);
};

// validation
function phaseCheck(io, socket, village, eventName){
    if(village.phase.gamePhase === GamePhaseAfternoon){
        return true
    } else {
        console.log("badRequest:", eventName, "can't call at", village.phase.gamePhase, "by", village.socketIdToUserId(socket.id));
        // TODO:before_gameだとjoinRoomに対してはユーザーの特定がIDだとできないのでundefinedになる
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest: "+eventName+" can't call at "+ village.phase.gamePhase})
        return false
    }
}
