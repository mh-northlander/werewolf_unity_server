// exports
module.exports = Guard;

// imports
common = require('./common');
Role = require('./role');


// guard
Guard.Name = "guard";

function Guard(){
    var vil = Object.create(Guard.prototype);
    Object.assign(vil, Role(Guard.Name))

    return vil;
}

Guard.prototype = {
    team   : common.type.HUMAN,

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

        village.actionStack.push(act);

        return {};
    },
}

// isGuard
Guard.isGuard = function(obj){
    return Role.isRole(obj, Guard.Name);
};

// Guard inherits Role
Object.setPrototypeOf(Guard.prototype, Role.prototype);
