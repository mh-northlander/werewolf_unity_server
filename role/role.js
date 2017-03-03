// exports
module.exports = Role;

// imports
common = require('./common');


// Role
function Role(type = "Role"){
    var role = Object.create(Role.prototype);

    role.type = type;

    return role;
}

Role.prototype = {
    // team represents how to win. (human / werewolf/ other)
    // team.other : TODO
    team    : common.type.NONE,

    // speacies represents head count for game-end check.
    // speacies.other will be ignored
    species : common.type.NONE,

    // sawAs represents how ze looks from seers
    fromSeer : common.type.NONE,

    // sawAs represents how ze looks from mediums
    fromMedium : common.type.NONE,

    // these represents which chat room ze will join
    // chatGroup will be used only if chatType == GROUP
    chatType  : common.chatType.PERSONAL,
    chatGroup : "none",

    // actionCandidates returns options for a night action.
    // type: (village, selfId) => [userId].
    // set null function or return [] to do nothing
    actionCandidates: null,

    // actionResult returns result for definite action.
    // type: (village, selfId) => result { subjectId, objectId, type, .. }.
    // set null function or return {} to do nothing
    actionResult: null,

    // evalActionNight returns result of action and/or stack it until morning
    // return {} to do nothing in the night (stacking still work)
    evalActionNight: (village, userId, act) => { return {}; },

    // mountEvent mounts event functions
    mountEvent: function(village){},
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
