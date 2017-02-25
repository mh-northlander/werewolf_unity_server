// exports
module.exports = Villager;

// imports
common = require('./common');
Role = require('./role');


// villager
Villager.Name = "Villager";

function Villager(){
    var vil = Object.create(Villager.prototype);
    Object.assign(vil, Role(Villager.Name))

    return vil;
}

Villager.prototype = {
    team   : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,
}

// isVillager
Villager.isVillager = function(obj){
    return Role.isRole(obj, Villager.Name);
};

// Villager inherits Role
Object.setPrototypeOf(Villager.prototype, Role.prototype);
