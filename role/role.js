// exports
module.exports = Role;

// imports
common = require('./common');


// Role
function Role(type = "Role"){
    var role = Object.create(Role.prototype);

    role.type = type;

    role.log = [];

    return role;
}

Role.prototype = {
    team    : common.type.NONE,
    species : common.type.HUMAN,

    chatType  : common.chatType.PERSONAL,
    chatGroup : "none",

    fromSeer   : common.type.NONE,
    fromMedium : common.type.NONE,

    // actionCandidates is a function:(village, baseCond) => candidates. null if not necessary
    actionCandidates: null,
    // actionResult returns result for definite action. null if not necessary
    actionResult: null,

    // evalActionNight returns result of action and/or just stack it
    evalActionNight: (village, userId, act) => { return {}; },
    // evalActionMorning evals action
    evalActionMorning: village => { return {}; },
};

/* memo
   var vil = Villager() // inherits Role, then:
   Role.isRole(vil)     // returns true
*/
Role.isRole = function(obj,type){
    if(!Role.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
