var chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

describe('Qd', function () {
  var Qd = require('../lib/qd'),
    qd, eventSpy;

  it('instantiating', function () {
    qd = new Qd();
  })

  beforeEach(function () {
    qd = new Qd();
  });

  describe('#queue()', function () {
    var queue;
    beforeEach(function () {
      eventSpy = sinon.spy();
      qd.on('queue', eventSpy);
      queue = qd.queue();
    });

    it('returns a `Queue` instance', function () {
      queue.should.be.instanceOf(require('../lib/queue'));
    })

    it('and emit a `queue` event', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledOnce;
        done();
      }, 10);
    })

    it('with a queue as an arg', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledWith(queue);
        done();
      }, 10);
    })
  })
})