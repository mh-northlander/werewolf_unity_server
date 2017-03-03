// util funcs

// randomString: generate random string of given length made of [a-z0-9]
module.exports.randomString = function(length){
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

// suffleArray: suffle array randomly. destructive.
module.exports.suffleArray = function(arr){
    var crrIdx = arr.length;
    var rndIdx, tmpValue;

    while(crrIdx > 0){
        // take random one and put into last idx
        rndIdx = Math.floor(Math.random() * crrIdx);
        crrIdx -=1;

        tmpValue    = arr[crrIdx];
        arr[crrIdx] = arr[rndIdx];
        arr[rndIdx] = tmpValue;
    }
    return arr;
};
