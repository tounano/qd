'use strict';

module.exports = AbstractDao;

function AbstractDao() {}

AbstractDao.prototype.pullJobFromQueue = function (queue, jobName, cb) {
  throw new Error('pullJobFromQueue not implemented.');
}

AbstractDao.prototype.completePulledJob = function (pulledJob, result, cb) {
  throw new Error('completePulledJob not implemented.');
}

AbstractDao.prototype.failPulledJob = function (pulledJob, err, cb) {
  throw new Error('failPulledJob not implemented.');
}

AbstractDao.prototype.progressPulledJob = function (pulledJob, progress, total, cb) {
  throw new Error('progressPulledJob not implemented.');
}

AbstractDao.prototype.addFailedAttemptToPulledJob = function (pulledJob, restartAt, cb) {
  throw new Error('addFailedAttemptToPulledJob not implemented.');
}

AbstractDao.prototype.saveNewJob = function (newJob, cb) {
  throw new Error('saveNewJob not implemented.');
}
