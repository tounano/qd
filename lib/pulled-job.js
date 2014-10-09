'use strict';
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;

module.exports = PulledJob;

function PulledJob(id, state) {
  this.id = id;
  this.state = state;
  this.name = state.name;
  this.payload = state.payload;
}
inherits(PulledJob, EventEmitter);

PulledJob.prototype.complete = function (result) {
  var self = this;
  process.nextTick(function () {
    self.emit('complete', result);
    self.close();
  })
}

PulledJob.prototype.progress = function (completed, total) {
  var self = this;
  process.nextTick(function () {
    self.emit('progress', completed, total);
  })
}

PulledJob.prototype.fail = function (err) {
  var self = this;

  process.nextTick(function () {
    if (++self.state.attempts < self.state.maxAttempts) {
      var restartAt = new Date().getTime(),
        backoff = self.state.backoff;

      if (backoff === true)
        restartAt += self.state.delay || 0;
      else if (backoff && backoff.type == 'fixed' && backoff.delay)
        restartAt += backoff.delay;
      else if (backoff && backoff.type == 'exponential' && (backoff.delay || self.state.delay))
        restartAt += Math.round( (backoff.delay || self.state.delay) * 0.5 * ( Math.pow(2, self.state.attempts) - 1) );

      self.emit('failedAttempt', restartAt, err);
      return self.close();
    }

    self.emit('failed', err);
    self.close();
  })
}

PulledJob.prototype.close = function () {
  this.emit('close');
  this.removeAllListeners();
}