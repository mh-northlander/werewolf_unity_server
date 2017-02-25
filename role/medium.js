// exports
module.exports = Medium;

// imports
common = require('./common');
Role = require('./role');


// medium
Medium.Name = "Medium";

function Medium(){
    var medium = Object.create(Medium.prototype);
    Object.assign(vil, Role(Medium.Name))

    return medium;
}

Medium.prototype = {
    team   : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionResult: function(village){
        if(village.phase.dayCount <= 0){ return {}; }

        return {}; // TODO: vote log

        targetId  = village.log[village.phase.dayCount].execution.executedId;
        target    = village.users[targetId];
        mediumRes = target.role.fromMedium;
        return {
            userName : target.name,
            result   : mediumRes==common.type.WEREWOLF ? mediumRes : common.type.HUMAN,
        };
    },
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
