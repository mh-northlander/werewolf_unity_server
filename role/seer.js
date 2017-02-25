// exports
module.exports = Seer;

// imports
common = require('./common');
Role = require('./role');


// seer
Seer.Name = "Seer";

function Seer(){
    var seer = Object.create(Seer.prototype);
    Object.assign(seer, Role(Seer.Name))

    return seer;
}

Seer.prototype = {
    team   : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionCandidates: function(village, selfId){
        return village.listMembersWithCondition({
            alive  : true,
            except : this.log.reduce((ret,val)=>{
                ret.push(val.userId);
                return ret
            }, [selfId])
        });
    },

    evalActionNight: function(village, userId, act){
        // act: { type:"see", userId }
        // log
        this.log.push({ userId: act.userId });

        if(!village.actionStack["see"]){ village.actionStack["see"] = []; }
        village.actionStack["see"].push({
            subjectId : userId,
            objectId  : act.userId,
        });

        seerRes = village.users[act.userId].role.fromSeer;
        return {
            objectId : act.userId,
            result   : seerRes==common.type.WEREWOLF ? seerRes : commontype.HUMAN,
        }
    }
}

// isSeer
Seer.isSeer = function(obj){
    return Role.isRole(obj, Seer.Name);
};

// Seer inherits Role
Object.setPrototypeOf(Seer.prototype, Role.prototype);
