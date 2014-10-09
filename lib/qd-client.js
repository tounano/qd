'use strict';
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter,
  Qd = require('./qd'),
  Brocast = require('brocast').Brocast,
  QueueRepository = require('./persistence/queue-repository');

module.exports = QdClient;

function QdClient(dao, opts) {
  opts = opts || {};
  this.qd = opts.qd || new Qd(opts);
  this.brocast = opts.brocast || new Brocast();

  var self = this,
    queueRepositoryFactory = opts.queueRepositoryFactory || defaultQueueRepositoryFactory(dao, opts);

  this.qd.on('queue', function (queue) {
    queueRepositoryFactory(self.brocast.channel(queue.name), queue);
  })
}
inherits(QdClient, EventEmitter);

QdClient.prototype.queue = function (name) {return this.qd.queue(name); }

function defaultQueueRepositoryFactory(dao, opts) {
  return function (channel, queue) {
    return QueueRepository(dao, channel, queue, opts);
  }
}