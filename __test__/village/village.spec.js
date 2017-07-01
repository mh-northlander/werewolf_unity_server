var assert = require('assert');

const village = require('../../village/');
const phase = require('../../village/phase').GamePhase
const role = require('../../role')

const vil = village.Village('111111');

const participantsList = {
    'hoge': {userId:'hoge', socktId:'12345', name:'hoge'},
    'piyo': {userId:'piyo', socktId:'23456', name:'piyo'},
    'fuga': {userId:'fuga', socktId:'34567', name:'fuga'}
}

const roleList = ['Werewolf', 'Villager', 'Seer']


describe('villageを動かすテスト', function(){
    it('addUser', function(){
        for(id in participantsList){
            var ppt = participantsList[id];
            vil.addUser(ppt.userId, ppt.socktId, ppt.name);
        }
        assert.equal(vil.users.get('hoge').name, 'hoge');
    });

    it('updateRule', function(){
        // TODO
    });

    it('readyToShift', function(){
        assert.equal(vil.readyToShift(), false);
        for(const [k, v] of vil.users){
            v.readyToShift = true;
        }
        assert.equal(vil.readyToShift(), true);
    });

    it('shiftPhase', function(){
        assert.equal(vil.shiftPhase(phase.BEFOREGAME).gamePhase, phase.BEFOREGAME);
        assert.equal(vil.shiftPhase(phase.NIGHT).gamePhase, phase.NIGHT);
        assert.equal(vil.shiftPhase(phase.MORNING).gamePhase, phase.MORNING);
        assert.equal(vil.shiftPhase(phase.DAYTIME).gamePhase, phase.DAYTIME);
        assert.equal(vil.shiftPhase(phase.AFTERNOON).gamePhase, phase.AFTERNOON);
        assert.equal(vil.shiftPhase(phase.EVENING).gamePhase, phase.EVENING);
        assert.equal(vil.shiftPhase(phase.AFTERGAME).gamePhase, phase.AFTERGAME);
        vil.shiftPhase(phase.BEFOREGAME);
        vil.phase.dayCount = 0;
    });

    it('action', function(){
        // TODO
    });

    it('getCandidatesMap', function(){
        vil.shiftPhase(phase.NIGHT);
        let idx = 0;
        for (const [userId, user] of vil.users){
            user.role = role[roleList[idx]]();
            user.role.mountEvents(vil);
            idx++;
        }
        assert.equal(vil.getCandidatesMap().size, 0);
        vil.phase.dayCount = 1;
        assert.deepEqual(vil.getCandidatesMap().get('hoge'), ['piyo','fuga']);
    });

    it('removeUser', function(){
        vil.removeUser('hoge');
        assert.equal(vil.users.has('hoge'), false);
    });

});
