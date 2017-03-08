// export
module.exports = {
    FinishDiscussion: finishDiscussion,

    Begin: begin,
    End  : end,
};

// import
const GamePhaseDaytime = require('../village/phase').GamePhase.DAYTIME;
const afternoon = require("./afternoon");


// finishDiscussion
function finishDiscussion(io, socket, village){
    return function(){
        const userId = village.socketIdToUserId(socket.id);
        const user = village.users.get(userId);
        user.readyToShift = true;

        console.log("finish discussion: " + user.name);
        if(village.readyToShift()){
            end(io, village);
        }
    };
}


// begin
function begin(io, village){
    console.log("daytime begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseDaytime);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => { end(io, village); }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("daytime end");
    afternoon.Begin(io, village);
};
