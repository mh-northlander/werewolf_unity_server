// export
module.exports = {
    Begin: begin,
    End  : end,
};


// import
GamePhaseEvening = require('../village/phase').GamePhase.EVENING;
night = require('./night');

// eveningResult

//// emit
// begin
function begin(io, village){
    console.log("evening b");
    // shift phase
    phase = village.shiftPhase(GamePhaseEvening);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // evening result
    result = village.evalVote();
    io.sockets.emit("voteResult", result);
};

// end
function end(io, village){
    console.log("evening e");
    night.Begin(io, village);
};
