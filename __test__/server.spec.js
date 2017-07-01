var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:3000/';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom', userId:'hogehoge'};
var chatUser2 = {'name':'Sally', userId:'hogehoge2'};
var chatUser3 = {'name':'Dana', userId:'hogehoge3'};

describe("Chat Server",function(){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    it('Should memberChanged function', function(done){
        client1.emit('joinRoom', chatUser1);

        client2.on('memberChanged', function(data){
            data[0].should.have.enumerable('name', 'Tom')
            data[0].should.have.enumerable('id', 'hogehoge')
            done();
        });
    });
});
