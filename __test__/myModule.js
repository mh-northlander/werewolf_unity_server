//myModule.js

exports.greet = function(name) {
  return "Hello,"+ name;
}

exports.greetAsync = function(name,callback) {
    var greet = "Hello,"+ name;
    callback(greet);
}
