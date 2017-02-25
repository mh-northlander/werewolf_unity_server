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
    team    : common.type.WEREWOLF,
    species : common.type.WEREWOLF,

    chatType  : common.chatType.GROUP,
    chatGroup : "werewolf",

    fromSeer   : common.type.WEREWOLF,
    fromMedium : common.type.WEREWOLF,

    actionCandidates: function(village, selfId){
        return village.listMembersWithCondition({
            alive   : true,
            notWolf : true,
            except  : [selfId],
        })
    },

    evalActionNight: function(village, userId, act){
        // act: { type:"bite", userId, power }
        village.actionStack.push(act);

        return {
            wolfName : village.users[userId].name,
            userName : village.users[act.userId].name,
            power    : act.power,
        };
    }
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
