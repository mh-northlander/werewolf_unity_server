class User{
    constructor(name, socketId){
        this._name = name;
        this._role = "none";
        this._alive = true;
        this._socketId = socketId;
    }

    set name(name){ this._name = name; }
    get name(){ return this._name; }

    set role(role){ this._role = role; }
    get role(){ return this._role; }

    set alive(alive){ this._alive = alive; }
    get alive(){ return this._alive; }

    get socketId(){ return this._socketId; }
}

module.exports = {
    User: User,
}
