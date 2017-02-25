// exports
module.exports = Village;

// imports
Phase = require('./phase');
User  = require('./user');
Rule  = require('./rule');
Log   = require('./log');

role = require("../role/");

// Village
function Village(villageId){
    var village = Object.create(Village.prototype);

    village.Id = villageId;
    village.masterId = null;
    village.users = {};
    village.rule = Rule();

    village.phase = Phase();
    village.log = [Log()];
    village.voteStack = {};

    village.actionStack = {};

    return village;
}

Village.prototype = {
    // village
    closeVillage: function(){
        // this func resets itself,
        // since currently we use one global vil.
        this.masterId = null;
        this.users = {};
    },

    // user
    masterUser: function(){
        return this.masterId ? null : this.users[masterId];
    },
    addUser: function(userId, socketId, name){
        if(userId in this.users){ return; }

        this.users[userId] = User(userId, name, socketId);
        if(this.masterId == null){
            this.masterId = userId;
        }
    },
    updateUser: function(userId, socketId, name){
        if(!(userId in this.users)){ return; }

        this.users[userId].name = name;
        this.users[userId].socketId = socketId;
    },
    removeUser: function(userId){
        delete this.users[userId];
    },

    // rule
    updateRule: function(dayTime, dayTimeDecreasesBy, nightTime, firstNightSee, roleLackable){
        this.rule.update(dayTime, dayTimeDecreasesBy, nightTime, firstNightSee, roleLackable);
    },

    // phase
    readyToShift: function(){
        // everyone ready except deads
        for(key in this.users){
            if(this.users[key].alive && !this.users[key].readyToShift){
                return false;
            }
        }
        return true;
    },
    shiftPhase: function(nPhase){
        // shift
        console.log("shift: " + this.phase.gamePhase + " to " + nPhase);
        this.phase.phaseShift(nPhase, this.rule.dayTime, this.rule.nightTime);

        // reset flg
        Object.keys(this.users).forEach((key)=>{
            this.users[key].readyToShift = false;
        });

        return this.phase
    },

    // action
    getCandidatesMap: function(){
        Object.keys(this.users).reduce((ret,userId)=>{
            if(this.users[userId].alive && this.users[userId].role.actionCandidates){
                list = this.users[userId].role.actionCandidates(this, userId);
                if(!list == []){
                    ret[userId] = list;
                }
            }
            return ret;
        }, {})
    },
    getResultMap: function(){
        Object.keys(this.users).reduce((ret,userId)=>{
            if(this.users[userId].alive && this.users[userId].role.actionResult){
                res = this.users[userId].role.actionResult(this);
                if(!res == {}){
                    ret[userId] = res;
                }
            }
            return ret;
        }, {})
    },
    evalActionMorning: function(){
        if(this.phase.dayCount == 1){ return { deads:[] }; }

        deads = [];
        // see
        if(this.actionStack["see"]){
            for(e of this.actionStack["see"]){
                deads = deads.concat(this.event_saw(e.subjectUserId, e.objectUserId));
            }
        }

        //// bite
        if(this.actionStack["bite"]){
            // summarize all bite action
            summary = {} // objectId -> { powerSum, subjectIds, subjectPower }
            for(e of this.actionStack["bite"]){
                if(summary[e.objectId]){ // init
                    summary[e.objectId] = {
                        powerSum     : 0,
                        subjectPower : 0,
                        subjectIds   : [],
                    };
                }
                summary[e.objectId].powerSum += e.power
                if       (e.power >  summary[e.objectId].subjectPower){
                    summary[e.objectId].subjectIds   = [e.subjectId];
                    summary[e.objectId].subjectPower = e.power;
                } else if(e.power == summary[e.objectId].subjectPower){
                    summary[e.objectId].subjectIds.push(e.subjectId);
                }
            }
            // search victim
            objectIds = [];
            maxPower = 0;
            for(objectId in summary){
                if       (summary[objectId].powerSum >  maxPower){
                    objectIds = [objectId];
                    maxPower  = summary[objectId].powerSum;
                } else if(summary[objectId].powerSum == maxPower){
                    objectIds.push(objectId);
                }
            }
            // random choice if tie
            objectId   = objectIds[Math.floor(Math.random() * objectIds.length)];
            subjectIds = summary[objectId];
            deads = deads.concat(this.event_bited(
                subjectIds[Math.floor(Math.random() * subjectIds.length)], objectId));
        }

        //
        return {
            deadIds: deads,
        };
    },

    // event
    //event : { // event funcs return dead list [userId]
    event_saw: function(subjectId, objectId, base=[]){
        return base;
    },
    event_bited: function(subjectId, objectId, base=[]){
        return this.event_died(objectId, base);
    },
    event_executed: function(objectId, base=[]){
        return this.event_died(objectId, base);
    },
    event_died: function(objectId, base=[]){
        this.users[objectId].alive = false;
        return base.concat([objectId]);
    },
    //},

    // vote
    voteCandidates: function(subjectUserId){
        return this.listMembersWithCondition({
            alive  : true,
            except : [subjectUserId],
        })
    },
    addVote: function(subjectUserId, vote){
        // vote: { userName[] } // TODO : userName -> userId
        console.log(vote);

        for(name of vote.userName){
            votedUserId = this.nameToUserId(vote.userName)
            if(!votedUserId){ return; }

            if(!this.voteStack[votedUserId]){
                this.voteStack[votedUserId] = 0;
            }
            this.voteStack[votedUserId] += 1;
        }
    },
    evalVote: function(){
        maxVotes = 0;
        executedId = null;
        for(userId in this.voteStack){
            if(this.voteStack[userId] > maxVotes){
                executedId = userId,
                maxVotes = this.voteStack[userId]
            }
        }

        console.log(executedId);
        console.log(this.users[executedId]);

        deads = this.event_executed(executedId);
        idx = deads.indexOf(executedId);
        deads = deads.splice(idx, 1);
        return {
            executedId   : executedId,
            executedName : this.users[executedId].name,
            deadIds      : deads,
        };
    },

    // util
    listMembersWithCondition: function(cond){
        /* condition
           alive  : bool
           except : [userId]

           notWolf : bool
        */
        return Object.keys(this.users).reduce((ret,userId)=>{
            user = this.users[userId];

            if(cond.alive  && !user.alive){ return ret; }
            if(cond.except && cond.except.indexOf(userId) >= 0 ){ return ret; }

            if(cond.notWold && user.role.species==role.common.type.WEREWOLF){ return ret; }

            ret.push({
                userName: user.name,
                userId:   userId,
            });
            return ret;
        }, []);
    },

    socketIdToUserId: function(socketId){
        for(key in this.users){
            if(this.users[key].socketId == socketId){
                return key;
            }
        }
    },
    userIdToSocketId: function(userId){
        return this.users[userId].socketId;
    },
    nameToUserId: function(name){
        for(userId in this.users){
            if(name == this.users[userId].name){
                return userId;
            }
        }
        console.log("There are no user has name: " + name + ".")
    },
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
