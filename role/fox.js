// exports
module.exports = Fox;

// imports
common = require('./common');
Role = require('./role');


// fox
Fox.Name = "Fox";

function Fox(){
    var fox = Object.create(Fox.prototype);
    Object.assign(fox, Role(Fox.Name))

    return fox;
}

Fox.prototype = {
    team       : common.type.OTHER,
    species    : common.type.OTHER,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    mountEvent: function(village){
        // die when sew
        oldSaw = village.event_saw;
        village.event_saw = function(subjectId, objectId, base=[]){
            if(Fox.isFox(village.users.get(objectId).role)){
                base = village.event_died(objectId, base);
            }
            return oldSaw(objectId, base);
        };

        // won't die when bited
        oldBited = village.event_bited;
        village.event_bited = function(subjectId, objectId, base=[]){
            if(Fox.isFox(village.users.get(objectId).role)){
                return base;
            }
            return oldBited(subjectId, objectId, base=[]);
        };
    },
}

// isFox
Fox.isFox = function(obj){
    return Role.isRole(obj, Fox.Name);
};

// Fox inherits Role
Object.setPrototypeOf(Fox.prototype, Role.prototype);
