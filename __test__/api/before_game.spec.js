var assert = require('assert');
var myModule = require('../../api/before_game');

describe('myModule', function () {
    describe('JoinRoom', function () {
        it('引数に応じて決まった文字列を返すこと', function () {
            assert.equal(myModule.JoinRoom('taro'), 'Hello,taroo');
        });
    });
});
