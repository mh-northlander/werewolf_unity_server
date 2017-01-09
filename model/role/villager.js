// imports
consts = require('./constants');
Role = require('./role');

// exports
module.exports = Villager;


// villager
var villagerType = "villager";

function Villager(){
    var vil = Object.create(Villager.prototype);
    Object.assign(vil, Role(villagerType))

    vil.chatLog = [];

    return vil;
}

Villager.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,

    Chat : function(message){
        this.chatLog.push(message);
    },
}

// isVillager
Villager.isVillager = function(obj){
    return Role.isRole(obj, villagerType);
};

// Villager inherits Role
Object.setPrototypeOf(Villager.prototype, Role.prototype);
