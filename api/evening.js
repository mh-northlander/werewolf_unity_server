// export
module.exports = {
    EveningResultChecked: eveningResultChecked,

    Begin: begin,
    End  : end,
};


// import
const GamePhaseEvening = require('../village/phase').GamePhase.EVENING;
const night = require('./night');

// eveningResultChecked
function eveningResultChecked(){
    return function(){
        const userId = village.socketIdToUserId(socket.id);
        const user = village.users.get(userId);
        user.readyToShift = true;

        console.log("evening result checked: " + user.name);
        if(village.readyToShift()){
            end(io, village);
        }
    };
}

//// emit
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
};

// end
function end(io, village){
    console.log("evening end");
    night.Begin(io, village);
};
