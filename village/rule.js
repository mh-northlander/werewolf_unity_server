// exports
module.exports = Rule;

// imports
role = require("../role/");

// rule
function Rule(){
    var rule = Object.create(Rule.prototype);

    // time for discussion in the daytime (sec)
    rule.dayTime = 1;
    // modify dayTime each day for convinience
    rule.dayTimeDecreasesBy = 1;
    // time for discussion or action in the night (sec)
    rule.nightTime = 1;

    // how Seer acts in the first night. (None / Given / Choice)
    rule.firstNightSee = role.Seer.firstNightSee.Given;
    // the first victim (NPC) can have role
    rule.roleLackable = false;

    // number of members. minimum 4
    rule.member = 4;
    // set of role in this village. Map(name -> num)
    rule.roleSet = role.defaultRoleSet(rule.member);

    return rule;
};

Rule.prototype = {
    updateBase: function(q){
        if(q.dayTime){ this.dayTime = q.dayTime; }
        if(q.dayTimeDecreasesBy){ this.dayTimeDecreasesBy = q.dayTimeDecreasesBy; }

        if(q.nightTime){ this.nightTime = q.nightTime; }

        if(q.firstNightSee){ this.firstNightSee = q.firstNightSee; }
        if(q.roleLackable){ this.roleLackable = q.roleLackable; }
    },
    updateRoleSet: function(m){ // m: Map name -> num
        for(var name of role.roleNameList){
            if(m.has(name)){
                this.roleSet.set(name, m.get(name));
            }
        }
    },

    roleSetJSON: function(){
        o = {};
        for(var [name,n] of this.roleSet){
            o[name] = n;
        }
        return o;
    },

    toJSON: function(){
        ret = Object.assign({}, this);
        ret.roleSet = this.roleSetJSON();
        return ret;
    },
};

Rule.JSONToRoleMap = function(obj){
    m = new Map();
    for(var name of role.roleNameList){
        m.set(name, obj[name] ? obj[name] : 0)
    }
    return m;
};

Rule.isRule = (obj,type)=>{
    if(!Rule.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
