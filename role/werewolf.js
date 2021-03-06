"use strict";

// exports
module.exports = Werewolf;

// imports
const common = require('./common');
const Role = require('./role');


// werewolf
Werewolf.Name = "Werewolf";

function Werewolf(){
    const wolf = Object.create(Werewolf.prototype);
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
        if(village.phase.dayCount === 0){ return []; }

        return village.listUserIdsWithCondition({
            alive  : true,
            except : [selfId],
            exceptFunc : user => {
                return (user.chatRoom === this.chatGroup);
            },
        })
    },

    evalActionNight: function(village, selfId, act){
        console.log("wolf " + village.users.get(selfId).name);

        // act: { type:"bite", userId, power }
        // first night
        if(village.phase.dayCount === 0){ return {}; }

        const ret = {
            subjectId : selfId,
            objectId  : act.userId,
            power     : Number(act.bitePower),
        };

        if(!village.actionMap.has("bite")){ village.actionMap.set("bite", []); }
        village.actionMap.get("bite").push(ret);

        return {}; // don't inform (for raccoon)
    },
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
