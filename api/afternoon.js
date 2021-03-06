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
const common = require("./common")


// vate
function vote(io, socket, village){
    return function(vote){
        if(common.IsValidPhase(io, socket, village, GamePhaseAfternoon, "vote") !== true){
            return
        }
        const userId = village.socketIdToUserId(socket.id);

        // vote: [userId]
        console.log(village.users.get(userId).name +
                    " votes to " + village.users.get(vote[0]).name);

        // log
        village.log.day[village.phase.dayCount].vote[userId] = vote;


        if(!village.users.get(userId).readyToShift){ // prevent multi-vote
            village.addVote(userId, vote);
            village.users.get(userId).readyToShift = true;
        }

        if(village.readyToShift()){
            end(io, village);
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
