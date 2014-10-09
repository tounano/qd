'use strict';
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter,
  Queue = require('./queue');

module.exports = Qd;

function Qd(opts) {
  opts = opts || {};
  this._queueFactory = opts.queueFactory || defaultQueueFactory(opts);
}
inherits(Qd, EventEmitter);

Qd.prototype.queue = function (name) {
  var self = this, queue = this._queueFactory(name);

  process.nextTick(function () {
    self.emit('queue', queue);
  })

  return queue;
}

function defaultQueueFactory(opts) {
  return function (name) {
    return new Queue(name, opts);
  }
}