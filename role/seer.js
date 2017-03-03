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

    seer.log = [];

    return seer;
}

Seer.prototype = {
    team       : common.type.HUMAN,
    species    : common.type.HUMAN,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionCandidates: function(village, selfId){
        // first night
        if(village.phase.dayCount == 0){
            switch(village.rule.firstNightSee){
            case Seer.firstNightSee.None:
            case Seer.firstNightSee.Given:  return [];
            case Seer.firstNightSee.Choice: break;
            default:
                console.log("error: invalid first night seer");
            }
        }

        return village.listUserIdsWithCondition({
            alive  : true,
            except : this.log.reduce((ret,userId)=>{
                ret.push(userId);
                return ret
            }, [selfId])
        });
    },

    actionResult: function(village, selfId){
        if(village.phase.dayCount != 0){ return {}; }
        if(village.rule.firstNightSee != Seer.firstNightGiven){ return {}; }

        cIds = village.listUserIdsWithCondition({
            alive   : true,
            except  : [selfId],
            exFunc  : userRole => {
                return (role.fromSeer != common.type.WEREWOLF) &&
                    (role.Fox.isFox(userRole));
            },
        });
        cId = cIds[Math.floor(Math.random() * cIds.length)];

        return evalActionNight(village, selfId, { type: "see", userId: cid });
    },

    evalActionNight: function(village, selfId, act){
        // act: { type:"see", userId }
        // log
        this.log.push(act.userId);

        if(!village.actionMap.has("see")){ village.actionMap.set("see", []); }
        village.actionMap.get("see").push({
            subjectId : selfId,
            objectId  : act.userId,
        });

        seerRes = village.users.get(act.userId).role.fromSeer;
        return {
            objectId : act.userId,
            type     : seerRes==common.type.WEREWOLF ? seerRes : commontype.HUMAN,
        }
    },
}

//
Seer.firstNightSee = {
    None   : "firstNightSee_none",
    Choice : "firstNightSee_choice",
    Given  : "firstNightSee_given",
};

// isSeer
Seer.isSeer = function(obj){
    return Role.isRole(obj, Seer.Name);
};

// Seer inherits Role
Object.setPrototypeOf(Seer.prototype, Role.prototype);
