const cron = require('cron')
const assert = require('assert')

/*
 *  opt.onTick (required) function to be executed on time
 */
function createJob(opt) {
  assert(opt.onTick, 'onTick is required')

  return new cron.CronJob({
    cronTime: '* * * * *',
    onTick: opt.onTick,
    start: false,
    timeZone: 'Asia/Taipei'
  })
}

module.exports = createJob
