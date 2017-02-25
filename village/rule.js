// exports
module.exports = Rule

// imports


// rule
function Rule(){
    var rule = Object.create(Rule.prototype);

    rule.dayTime = 1;
    rule.dayTimeDecreasesBy = 1;

    rule.nightTime = 1;

    rule.firstNightSee = Rule.firstNightSee.Given;
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

Rule.firstNightSee = {
    None   : "firstNightSee_none",
    Choice : "firstNightSee_choice",
    Given  : "firstNightSee_given",
};

Rule.isRule = (obj,type)=>{
    if(!Rule.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
