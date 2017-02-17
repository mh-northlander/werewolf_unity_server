// exports
module.exports = Werewolf;

// imports
common = require('./common');
Role = require('./role');


// werewolf
Werewolf.Name = "werewolf";

function Werewolf(){
    var vil = Object.create(Werewolf.prototype);
    Object.assign(vil, Role(Werewolf.Name))

    return vil;
}

Werewolf.prototype = {
    team   : common.WEREWOLF,
    isWolf : true,

    fromSeer   : common.WEREWOLF,
    fromMedium : common.WEREWOLF,

    candidateCondition: ()=>{
        return {
            alive: true,
            notWolf: true,
        };
    },
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
