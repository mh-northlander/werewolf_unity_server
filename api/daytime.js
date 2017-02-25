// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
GamePhaseDaytime = require('../village/phase').GamePhase.DAYTIME;
afternoon = require("./afternoon");


// begin
function begin(io, village){
    console.log("daytime b");
    // shift phase
    phase = village.shiftPhase(GamePhaseDaytime);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => {
        end(io, village);
    }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("daytime e");
    afternoon.Begin(io, village);
};
