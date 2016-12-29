// requires
model = require('./../model')

// exports
module.exports = {
    Room: Room,
}

// Room
function Room(roomId){
    var room = Object.create(Room.prototype);

    room.Id = roomId;
    room.masterId = null;
    room.users = {};
    room.rule = {};

    return room;
}
//// prototype checker (not needed now)
// Room.isRoom = function(obj,type){
//     if(!Room.prototype.isPrototypeOf(obj)){
//         return false;
//     }
//     return type ? obj.type === type : true;
// };
Room.prototype = {
    closeRoom: function(){
        // this func resets itself,
        // since currntly we use one global room.
        this.masterId = null;
        this.users = {};
    },

    addUser: function(userId, user){
        if(this.masterId == null){
            this.masterId = userId;
        }
        console.log(model.user.isUser(user,false))
        this.users[userId] = user; // should check if isUser(user)
    },
    removeUser: function(userId){
        if(userId == this.masterId){
            this.closeRoom();
        } else {
            delete this.users[userId];
        }
    },

    // info
    getUserNameList(){
        var res = [];
        for(var userId in this.users){
            res.push(this.users[userId].name)
        }
        return res;
    },
};
