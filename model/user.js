// imports

// exports
module.exports = User;

// User
function User(userName, socketId){
    var user = Object.create(User.prototype);

    user.socketId = socketId;
    user.name = userName;

    user.alive = true;
    user.role = "";

    return user;
}

User.prototype = {};

User.isUser = function(obj,type){
    if(!User.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
