// exports
module.exports = Guard;

// imports
common = require('./common');
Role = require('./role');


// guard
Guard.Name = "Guard";

function Guard(){
    var guard = Object.create(Guard.prototype);
    Object.assign(guard, Role(Guard.Name))

    guard.guardingId = null;

    return guard;
}

Guard.prototype = {
    team   : common.type.HUMAN,
    species : common.type.HUMAN,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionCandidates: function(village, selfId){
        exp = [selfId];
        if(this.log.length > 0){
            exp.push(this.log[this.log.length-1].userId)
        }

        return village.listMembersWithCondition({
            alive  : true,
            except : exp,
        })
    },

    evalActionNight: function(village, userId, act){
        // act: { type:"guard", userId }
        // log
        this.log.push({ userId: act.userId });
        this.guardingId = act.userId;

        return {};
    },

    mountEvent: function(village){
        oldBited = village.event.bited;
        village.event.bited = function(subjectUserId, objectUserId, base=[]){
            if(objectUserId == this.guardingId){
                return base;
            }
            return oldBited(subjectUserId, objectUserId, base=[]);
        };
    }
}

// isGuard
Guard.isGuard = function(obj){
    return Role.isRole(obj, Guard.Name);
};

// Guard inherits Role
Object.setPrototypeOf(Guard.prototype, Role.prototype);
