'use strict';

module.exports = NewJobRepository;

function NewJobRepository(dao, channel, job) {
  job.on('save', function () {
    dao.saveNewJob(job, function (err, id) {
      job.id = id;

      setTimeout(function () {
        channel.publish('waitingJob', job.name);
      }, job.state.startAt - new Date().getTime());

      var sub = channel.subscribe(id);

      job.on('close', function () {
        sub.unsubscribe();
      });

      sub.on('data', function (event) {
        job.emit.apply(job, event.msg);
      });
    });
  });

  job.on('complete', _closeJob);
  job.on('failed', _closeJob);

  function _closeJob() {
    process.nextTick(function () {job.close();})
  }
}