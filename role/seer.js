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
        // first night
        if(village.phase.dayCount == 0){
            switch(village.rule.firstNightSee){
            case Seer.firstNightSee.None:   return [];
            case Seer.firstNightSee.Given:  return village.listUserIdsWithCondition({
                alive   : true,
                exFunc  : userRole => {
                    return (role.fromSeer == common.type.HUMAN) &&
                        (role.Fox.isFox(userRole));
                },
            });
            case Seer.firstNightSee.Choice: break;
            default:
                console.log("error: seer firstNight");
            }
        }

        return village.listUserIdsWithCondition({
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

        if(!village.actionMap.has("see")){ village.actionMap.set("see", []); }
        village.actionMap.get("see").push({
            subjectId : userId,
            objectId  : act.userId,
        });

        seerRes = village.users.get(act.userId).role.fromSeer;
        return {
            objectId : act.userId,
            result   : seerRes==common.type.WEREWOLF ? seerRes : commontype.HUMAN,
        }
    }
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
