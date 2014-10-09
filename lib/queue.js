'use strict';
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter,
  NewJob = require('./new-job');

module.exports = Queue;

function Queue(name, opts) {
  opts = opts || {};
  this._newJobFactory = opts.newJobFactory || defaultNewJobFactory(opts);
  this.name = name;
}
inherits(Queue, EventEmitter);

Queue.prototype.pull = function (jobName, cb) {
  var self = this;
  process.nextTick(function () {
    self.emit('pullRequest', jobName, function (err, pulledJob) {
      if (err || !pulledJob) return cb(err, pulledJob);

      self.emit('pulledJob', pulledJob);
      cb(err, pulledJob);
    });
  })
}

Queue.prototype.job = function (name, payload) {
  var newJob = this._newJobFactory(name, payload);
  var self = this;
  process.nextTick(function () {self.emit('newJob', newJob.save())})
  return newJob;
}

function defaultNewJobFactory(opts) {
  return function (name, payload) {
    return new NewJob(name, payload, opts);
  }
}