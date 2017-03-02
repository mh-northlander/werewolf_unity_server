// exports
module.exports = {
    ReadyToShift: readyToShift,
};

// imports
GamePhase = require("../village/phase").GamePhase;
before_game = require("./before_game");
morning = require("./morning");
daytime = require("./daytime");
afternoon = require("./afternoon");
evening = require("./evening");


// readyToShift
function readyToShift(io, socket, village) {
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.users.get(userId).readyToShift = true;

        console.log(village.users.get(userId).name + " is ready");

        if(village.readyToShift()){
            switch(village.phase.gamePhase){
            case GamePhase.BEFOREGAME:
                before_game.StartGame(io, village)();
                break;
            case GamePhase.MORNING:
                morning.End(io, village);
                break;
            case GamePhase.DAYTIME:
                daytime.End(io, village);
                break;
            case GamePhase.AFTERNOON:
                afternoon.End(io, village);
                break;
            case GamePhase.EVENING:
                evening.End(io, village);
                break;
            default:
                console.log("error: readyToShift with phase " + village.phase.gamePhase);
                break;
            }
        }
    }
};
