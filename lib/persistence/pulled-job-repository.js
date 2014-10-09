'use strict';

module.exports = PulledJobRepository;

function PulledJobRepository(dao, channel, pulledJob) {
  channel.publish('pulledJob', pulledJob.id);
  channel.publish(pulledJob.id, ['pulled']);

  pulledJob.on('complete', function (result) {
    dao.completePulledJob(pulledJob, result, function (err) {
      channel.publish(pulledJob.id, ['complete', result]);
    });
  });

  pulledJob.on('failed', function (e) {
    dao.failPulledJob(pulledJob, e, function (err) {
      channel.publish(pulledJob.id, ['failed', e]);
    });
  });
  
  pulledJob.on('failedAttempt', function (restartAt, e) {
    dao.addFailedAttemptToPulledJob(pulledJob, restartAt, function (err) {
      channel.publish(pulledJob.id, ['failedAttempt', e]);
    });
  });

  pulledJob.on('progress', function (progress, total) {
    dao.progressPulledJob(pulledJob, progress, total, function (err) {
      channel.publish(pulledJob.id, ['progress', progress, total]);
    })
  })
}