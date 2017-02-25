// exports
module.exports = User;

// imports
role = require('../role/')


// User
function User(userId, userName, socketId){
    var user = Object.create(User.prototype);

    // info
    user.socketId = socketId;
    user.id = userId;
    user.name = userName;

    user.alive = true;
    user.readyToShift = false;
    user.guarded = false;

    user.role = role.Role(); // null role
    user.chatRoom = userId;

    return user;
}

User.prototype = {};

User.isUser = function(obj,type){
    if(!User.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
