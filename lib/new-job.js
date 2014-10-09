'use strict';
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;

module.exports = NewJob;

var defaultPriorities = {
  low: 10,
  normal: 0,
  medium: -5,
  high: -10,
  critical: -15
}

function NewJob(name, payload, opts) {
  opts = opts || {};
  var ts = new Date().getTime();

  this._priorities = opts.priorities || defaultPriorities;

  this.state = {
    name: name,
    status: 'waiting',
    payload: payload,
    priority: 0,
    delay: 0,
    startAt: ts,
    createdAt: ts
  }
}
inherits(NewJob, EventEmitter);

NewJob.prototype.save = function () {
  var self = this;
  process.nextTick(function () {
    self.emit('save');
    self.removeAllListeners('save');
  });
  return this;
}

NewJob.prototype.close = function () {
  this.emit('close');
  this.removeAllListeners();
}

NewJob.prototype.delay = function (delay) {
  this.state.delay = delay;
  this.state.startAt = this.state.createdAt + delay;
  return this;
}

NewJob.prototype.backoff = function (backoff) {
  this.state.backoff = backoff;
  return this;
}

NewJob.prototype.attempts = function (attempts) {
  this.state.attempts = 0;
  this.state.maxAttempts = attempts;
  return this;
}

NewJob.prototype.priority = function (priority) {
  this.state.priority = this._priorities[priority] || 0;
  return this;
}