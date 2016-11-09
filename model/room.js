model = require('./../model')

class Room {
    constructor(roomId){
        this._Id = roomId;
        this._users = {};
    }

    get roomId() { return this._id }

    joinUser(userId, user){
        this._users[userId] = user;
    }

    getUserNameList(){
        var list = [];
        for(var userId in this._users){
            list.push(this._users[userId].name)
        }
        return list;
    }
}

module.exports = {
    Room: Room,
}
