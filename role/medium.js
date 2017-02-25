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
    team    : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionResult: function(village){
        if(village.phase.dayCount <= 0){ return {}; }

        return {}; // TODO: vote log

        objectId  = village.log[village.phase.dayCount].execution.executedId;
        mediumRes = village.users[objectId].role.fromMedium;
        return {
            objectId : objectId,
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
