var chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

describe('Queue', function () {
  var Queue = require('../lib/queue'),
    queue,eventSpy, cbSpy;

  it('instantiating', function () {
    queue = new Queue();
  })

  describe('#pull()', function () {

    beforeEach(function () {
      eventSpy = sinon.spy();
      cbSpy = sinon.spy();
      queue.pull(cbSpy);
      queue.on('pullRequest', eventSpy);
    });

    it('emits a `pullRequest` event', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledOnce;
        done();
      }, 10);
    })

    it('with the provided callback as an arg', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledWith(cbSpy);
        done();
      }, 10);
    })
  })
})