'use strict';

var PulledJobRepository = require('./pulled-job-repository'),
  NewJobRepository = require('./new-job-repository');

module.exports = QueueRepository;

function QueueRepository(dao, channel, queue, opts) {
  opts = opts || {};

  var createPulledJobRepository =
    opts.pulledJobRepositoryFactory || createDefaultPulledJobRepositoryFactory(dao, channel);

  var createNewJobRepository =
    opts.newJobRepositoryFactory || createDefaultNewJobRepositoryFactory(dao, channel);

  queue.on('pullRequest', function (jobName, cb) {
    dao.pullJobFromQueue(queue, jobName, cb);
  });

  queue.on('pulledJob', function (pulledJob) {
    createPulledJobRepository(pulledJob);
  })

  queue.on('newJob', function (newJob) {
    newJob.queue = queue;
    createNewJobRepository(newJob);
  })
};

function createDefaultPulledJobRepositoryFactory(dao, channel) {
  return function (pulledJob) {
    return PulledJobRepository(dao, channel, pulledJob);
  }
}

function createDefaultNewJobRepositoryFactory(dao, channel) {
  return function (newJob) {
    return NewJobRepository(dao, channel, newJob);
  }
}