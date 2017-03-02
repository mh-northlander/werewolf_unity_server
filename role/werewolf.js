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
    team    : common.type.WEREWOLF,
    species : common.type.WEREWOLF,

    chatType  : common.chatType.GROUP,
    chatGroup : "werewolf",

    fromSeer   : common.type.WEREWOLF,
    fromMedium : common.type.WEREWOLF,

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

    evalActionNight: function(village, userId, act){
        // act: { type:"bite", userId, power }
        // first night
        if(village.phase.dayCount == 0){ return {}; }

        if(!village.actionMap.has("bite")){ village.actionMap.set("bite", []); }
        village.actionMap.get("bite").push({
            subjectId : userId,
            objectId  : act.userId,
            power     : act.power,
        });

        return {
            subjectId : userId,
            objectId  : act.userId,
            power     : act.power,
        };
    }
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
