// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
GamePhaseMorning = require('../village/phase').GamePhase.MORNING;
dayTime = require("./daytime");


// begin
function begin(io, village){
    console.log("morning b");
    // shift phase
    phase = village.shiftPhase(GamePhaseMorning);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // morning result
    results = village.evalActionMorning();
    io.sockets.emit("actionResult", results);
};

// end
function end(io, village){
    console.log("morning e");
    dayTime.Begin(io, village);
};
