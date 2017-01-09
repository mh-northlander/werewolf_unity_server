// imports
consts = require('./constants');

// exports
module.exports = Role;

// Role
function Role(type){
    var role = Object.create(Role.prototype);
    role.type = type;
    return role;
}

Role.prototype = {
    team       : consts.team.None,
    fromSeer   : consts.fromSeer.None,
    fromMedium : consts.fromSeer.None,
};

/* memo
   var vil = Villager() // inherits Role, then:
   Role.isRole(vil)     // returns true
*/
Role.isRole = function(obj,type){
    if(!Role.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
