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
        // vote: { userName[] }
        userId = village.socketIdToUserId(socket.id);

        if(!village.users[userId].readyToShift){
            village.addVote(userId, vote);
        }

        // check
        shared.ReadyToShift(io,socket,village)();
    };
};

// begin
function begin(io, socket, village){
    console.log("afternoon b");
    // shift phase
    phase = village.shiftPhase(GamePhaseAfternoon);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // vote candidate
    for(userId of Object.keys(village.users)){
        candidates = village.voteCandidates(userId);
        io.to(village.userIdToSocketId(userId)).emit("voteCandidates", candidates);
    }
};

// end
function end(io, socket, village){
    console.log("afternoon e");
    evening.Begin(io, socket, village);
};
