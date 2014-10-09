var chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

describe('PulledJob', function () {
  var PulledJob = require('../lib/pulled-job'),
    pulledJob, eventSpy;

  it('instantiating', function () {
    pulledJob = new PulledJob(123, {});
  })

  beforeEach(function () {
    eventSpy = sinon.spy();
  });

  describe('#complete()', function () {
    var tstResult = 'tstResult';

    beforeEach(function () {
      pulledJob = new PulledJob(123, {});
      pulledJob.on('complete', eventSpy);
      pulledJob.complete(tstResult);
    });

    it('shoule emit a complete event', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledOnce;
        done();
      }, 10);
    })

    it('with the result as an arg', function (done) {
      setTimeout(function () {
        eventSpy.should.have.been.calledWith(tstResult);
        done();
      }, 10);
    })

    it('and remove all event listeners', function (done) {
      var spy = sinon.spy(pulledJob, 'removeAllListeners');
      setTimeout(function () {
        spy.should.have.been.called;
        done();
      }, 10);
    })
  })

  describe('#fail()', function () {

    beforeEach(function () {
      pulledJob.on('failed', eventSpy);
    });

    context('when there is only one attempt', function () {
      it('should emit a `failed` event', function (done) {
        pulledJob.fail();
        pulledJob.on('failed', eventSpy);
        setTimeout(function () {
          eventSpy.should.have.been.called;
          done();
        }, 10);
      })

      it('only once', function (done) {
        pulledJob.fail();
        pulledJob.fail();
        setTimeout(function () {
          eventSpy.should.have.been.calledOnce;
          done();
        }, 10);
      })
    })

    context('when there is more than 1 attempt', function () {

      beforeEach(function () {
        pulledJob = new PulledJob(1, {attempts: 0, maxAttempts: 2})
      });

      it('should emit a `failedAttempt` event', function (done) {
        pulledJob.fail();
        pulledJob.on('failedAttempt', eventSpy);
        setTimeout(function () {
          eventSpy.should.have.been.called;
          done();
        }, 10);
      })

      it('only once', function (done) {
        pulledJob.fail();
        pulledJob.fail();
        pulledJob.on('failedAttempt', eventSpy);
        setTimeout(function () {
          eventSpy.should.have.been.calledOnce;
          done();
        }, 10);
      })

      it('with an error as the second arg', function (done) {
        pulledJob.fail('error');
        pulledJob.on('failedAttempt', eventSpy);
        setTimeout(function () {
          eventSpy.getCall(0).args[1].should.be.equal('error');
          done();
        }, 10);
      })

      it('`failed` event, shouldn`t be called', function (done) {
        pulledJob.fail('error');
        pulledJob.on('failed', eventSpy);
        setTimeout(function () {
          eventSpy.should.not.have.been.called;
          done();
        }, 10);
      })

      context('and backoff have been configured', function () {
        beforeEach(function () {
          pulledJob.state.delay = 2000;
        });
        context('to `true`', function () {
          it('should have the `restartAt` timestamp as the first arg', function (done) {
            pulledJob.state.backoff = true;
            pulledJob.fail('error');
            pulledJob.on('failedAttempt', eventSpy);
            setTimeout(function () {
              eventSpy.should.have.been.calledOnce;
              Math.floor(eventSpy.getCall(0).args[0] / 1000).should.be.equal(Math.floor((new Date().getTime()+2000)/1000));
              done();
            }, 10);
          })
        })

        context('to a `fixed` backoff', function () {
          it('should have the `restartAt` timestamp as the first arg', function (done) {
            var delay = 3000;
            pulledJob.state.backoff = {type: 'fixed', delay: delay};
            pulledJob.fail('error');
            pulledJob.on('failedAttempt', eventSpy);
            setTimeout(function () {
              eventSpy.should.have.been.calledOnce;
              Math.floor(eventSpy.getCall(0).args[0] / 1000).should.be.equal(Math.floor((new Date().getTime()+delay)/1000));
              done();
            }, 10);
          })
        })
      })
    })
  })

  describe('#progress()', function () {
    it('should emit a `progress` event', function (done) {
      pulledJob.progress();
      pulledJob.on('progress', eventSpy);
      setTimeout(function () {
        eventSpy.should.have.been.called;
        done();
      }, 10);
    })

    it('as many times as it was called', function (done) {
      pulledJob.progress();
      process.nextTick(function () {pulledJob.progress();})

      pulledJob.on('progress', eventSpy);
      setTimeout(function () {
        eventSpy.should.have.been.calledTwice;
        done();
      }, 10);
    })

    it('with the same args it was called with', function (done) {
      pulledJob.progress(50, 100);
      pulledJob.on('progress', eventSpy);
      setTimeout(function () {
        eventSpy.should.have.been.calledWith(50, 100);
        done();
      }, 10);
    })
  })
})