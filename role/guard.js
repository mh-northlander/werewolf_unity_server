// exports
module.exports = Guard;

// imports
const common = require('./common');
const Role = require('./role');


// guard
Guard.Name = "Guard";

function Guard(){
    const guard = Object.create(Guard.prototype);
    Object.assign(guard, Role(Guard.Name));

    guard.guardingId = null;
    guard.log = [];

    return guard;
}

Guard.prototype = {
    team   : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionCandidates: function(village, selfId){
        // first night
        if(village.phase.dayCount === 0){ return []; }

        let excp = [selfId];
        if(this.log.length > 0){
            excp.push(this.log[this.log.length-1].userId)
        }

        return village.listUserIdsWithCondition({
            alive  : true,
            except : excp,
        })
    },

    evalActionNight: function(village, selfId, act){
        //
        if(village.phase.dayCount === 0){ return {}; }

        // act: { type:"guard", userId }
        // log
        this.log.push(act.userId);
        this.guardingId = act.userId;

        return {};
    },

    mountEvents: function(village){
        const oldBited = village.event_bited;
        village.event_bited = function(subjectId, objectId, success, result={}){
            if(objectUserId === this.guardingId){
                return oldBited(subjectId, objectId, false, result);
            }
            return oldBited(subjectId, objectId, success, result);
        };
    },
}

// isGuard
Guard.isGuard = function(obj){
    return Role.isRole(obj, Guard.Name);
};

// Guard inherits Role
Object.setPrototypeOf(Guard.prototype, Role.prototype);
