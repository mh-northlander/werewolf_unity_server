// export
module.exports = {
    Vote : vote,

    Begin: begin,
    End  : end,
};

// imports
GamePhaseAfternoon = require('../village/phase').GamePhase.AFTERNOON;
shared = require('./shared');
evening = require('./evening');


// vate
function vote(io, socket, village){
    return function(vote){
        // vote: [userId]
        console.log(vote)
        userId = village.socketIdToUserId(socket.id);

        if(!village.users.get(userId).readyToShift){
            village.addVote(userId, vote);
        }

        // check
        shared.ReadyToShift(io,socket,village)();
    };
};

// begin
function begin(io, village){
    console.log("afternoon b");
    // shift phase
    phase = village.shiftPhase(GamePhaseAfternoon);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // vote candidate
    for(var [id,user] of village.users){
        candidates = village.voteCandidates(id);
        io.to(village.userIdToSocketId(id)).emit("voteCandidates", candidates);
    }
};

// end
function end(io, village){
    console.log("afternoon e");
    evening.Begin(io, village);
};
