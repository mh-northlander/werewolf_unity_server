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
    village.votedStack = {};

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
                deads = deads.concat(this.event.saw(e.subjectUserId, e.objectUserId));
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
            deads = deads.concat(this.event.bited(
                subjectIds[Math.floor(Math.random() * subjectIds.length)], objectId));
        }
        //
        return {
            deads: deads,
        };
    },

    // event
    event : { // event funcs return dead list [userId]
        saw: function(subjectUserId, objectUserId, base=[]){
            return base;
        },
        bited: function(subjectUserId, objectUserId, base=[]){
            return this.event.died(objectUserId, base);
        },
        executed: function(objectUserId, base=[]){
            return this.event.died(objectUserId, base);
        },
        died: function(objectUserId, base=[]){
            this.users[objectUserId].alive = false;
            return base.concat([objectUserId]);
        },
    },

    // vote
    voteCandidates: function(subjectUserId){
        return this.listMembersWithCondition({
            alive  : true,
            except : [subjectUserId],
        })
    },
    addVote: function(subjectUserId, vote){
      // vote: {userId:[]}
      votedName = vote.vote[0] //TODO:vote is Name list
      votedUserId = this.nameToUserId(votedName)

      if(votedUserId && (votedUserId in this.votedStack)){
        this.votedStack[votedUserId] = this.votedStack[votedUserId] + 1;
      } else if (votedUserId) {
        this.votedStack[votedUserId] = 1;
      }
    },
    evalVote: function(){
      maxVotes = 0;
      for(userId in this.votedStack){
        if(this.votedStack[userId] > maxVotes){
          candidateUserId = userId,
          maxVotes = this.votedStack[userId]
        }
      }
      this.killSomeone(userId);
      return {
        userName: this.users[candidateUserId].name,
        userId: candidateUserId
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
    nameToUserId: function(name){
      isDetected = false;
      for(key in this.users){
        if(name == this.users[key].name){
          isDetected = true;
          return this.users[key].id;
        }
      }
      if(isDetected == false){console.log("There are no user has name: " + name);}
    },
    killSomeone: function(userId){
      this.users[userId].alive = false
    }
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
