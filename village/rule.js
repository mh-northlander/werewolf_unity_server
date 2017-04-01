// exports
module.exports = Rule;

// imports
const util = require("../util");
const role = require("../role/");

// rule
function Rule(){
    const rule = Object.create(Rule.prototype);

    // time for discussion in the daytime (sec)
    rule.dayTime = 1;
    // modify dayTime each day for convinience
    rule.dayTimeDecreasesBy = 1;
    // time for discussion or action in the night (sec)
    rule.nightTime = 600;

    // the first victim (NPC) can have role
    rule.roleLackable = false;
    // how Seer acts in the first night. (None / Given / Choice)
    rule.firstNightSee = role.Seer.firstNightSee.Given;

    // set of role in this village. Map(name -> num)
    rule.roleSet = role.defaultRoleSet(8);

    return rule;
};

Rule.prototype = {
    update: function(r){ // r: rule obj
        if(r.dayTime)  { this.dayTime   = r.dayTime; }
        if(r.dayTimeDecreasesBy){ this.dayTimeDecreasesBy = r.dayTimeDecreasesBy; }
        if(r.nightTime){ this.nightTime = r.nightTime; }

        if(r.roleLackable) { this.roleLackable = r.roleLackable; }
        if(r.firstNightSee){ this.firstNightSee = r.firstNightSee; }

        if(r.roleSet){
            this.roleSet.clear();
            for(const name of role.roleNameList){
                this.roleSet.set(name, r.roleSet[name] ? r.roleSet[name] : 0);
            }
        }
    },

    suffledRoleList: function(){ // Map(name => n) -> [name]
        let a = [];
        for(const [name,n] of this.roleSet){
            for(let i=0; i<n; i++){
                a.push(name);
            }
        }
        return util.suffleArray(a);
    },

    // util
    toJSON: function(){
        let ret = Object.assign({}, this);

        ret.roleSet = {};
        for(const [name,n] of this.roleSet){
            ret[name] = n;
        }

        return ret;
    },
};

Rule.isRule = (obj,type)=>{
    if(!Rule.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
