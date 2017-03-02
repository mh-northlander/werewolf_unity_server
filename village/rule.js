// exports
module.exports = Rule;

// imports
firstNightSee = require("../role/seer").firstNightSee;


// rule
function Rule(){
    var rule = Object.create(Rule.prototype);

    rule.dayTime = 1;
    rule.dayTimeDecreasesBy = 1;

    rule.nightTime = 1;

    rule.firstNightSee = firstNightSee.Given;
    rule.roleLackable = false;

    return rule;
};

Rule.prototype = {
    update: function(dayTime, dayTimeDecreasesBy, nightTime, firstNightSee, roleLackable){
        if(dayTime){ this.dayTime = dayTime; }
        if(dayTimeDecreasesBy){ this.dayTimeDecreasesBy = dayTimeDecreasesBy; }

        if(nightTime){ this.nightTime = nightTime; }

        if(firstNightSee){ this.firstNightSee = firstNightSee; }
        if(roleLackable){ this.roleLackable = roleLackable; }
    },
};

Rule.isRule = (obj,type)=>{
    if(!Rule.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
