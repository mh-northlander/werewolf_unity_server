// requires
model = require('./../model')

// exports
module.exports = Room

// Room
function Room(roomId){
    var room = Object.create(Room.prototype);

    room.Id = roomId;
    room.masterId = null;
    room.users = {};
    room.rule = {};

    return room;
}
//// prototype checker (not necessary now)
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
        this.users[userId] = user; // maybe we should check if isUser(user)
    },
    removeUser: function(userId){
        if(userId == this.masterId){
            this.closeRoom();
        } else {
            delete this.users[userId];
        }
    },

    // info
    masterUser: function(){
        if(!this.users == {}){
            return this.users[this.masterId];
        }
        // return {};
    },

    getUserNameList: function(){
        var res = [];
        for(var userId in this.users){
            res.push(this.users[userId].name)
        }
        return res;
    },
};
