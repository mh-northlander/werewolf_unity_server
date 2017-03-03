// exports
module.exports = Werewolf;

// imports
common = require('./common');
Role = require('./role');


// werewolf
Werewolf.Name = "Werewolf";

function Werewolf(){
    var wolf = Object.create(Werewolf.prototype);
    Object.assign(wolf, Role(Werewolf.Name))

    return wolf;
}

Werewolf.prototype = {
    team       : common.type.WEREWOLF,
    species    : common.type.WEREWOLF,
    fromSeer   : common.type.WEREWOLF,
    fromMedium : common.type.WEREWOLF,

    chatType  : common.chatType.GROUP,
    chatGroup : "werewolf",

    actionCandidates: function(village, selfId){
        // first night
        if(village.phase.dayCount == 0){ return []; }

        return village.listUserIdsWithCondition({
            alive  : true,
            except : [selfId],
            exFunc : userRole => {
                return (userRole.chatGroup == this.chatGroup);
            },
        })
    },

    evalActionNight: function(village, selfId, act){
        // act: { type:"bite", userId, power }
        // first night
        if(village.phase.dayCount == 0){ return {}; }

        var ret = {
            subjectId : selfId,
            objectId  : act.userId,
            power     : act.power,
        };

        if(!village.actionMap.has("bite")){ village.actionMap.set("bite", []); }
        village.actionMap.get("bite").push(ret);

        return ret;
    },
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
