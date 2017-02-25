// exports
module.exports = Medium;

// imports
common = require('./common');
Role = require('./role');


// medium
Medium.Name = "medium";

function Medium(){
    var vil = Object.create(Medium.prototype);
    Object.assign(vil, Role(Medium.Name))

    return vil;
}

Medium.prototype = {
    team   : common.type.HUMAN,

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
