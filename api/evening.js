// export
module.exports = {
    Begin: begin,
    End  : end,
};


// import
model = require('./../model');
night = require('./night');

// eveningResult

//// emit
// begin
function begin(io, socket, village){
    // shift phase
    phase = village.shiftPhase(model.Phase.GamePhase.EVENING);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    //

};

// end
function end(io, socket, village){
    night.Begin(io, socket, village);
};
