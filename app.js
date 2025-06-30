const util = require('util');
util._extend = Object.assign;

var pmx     	= require('pmx');
var pm2     	= require('pm2');
var scheduler	= require('node-schedule');

require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss.l)' });

var conf = pmx.initModule({});

pm2.connect(function(err) {
    if (err) {
        console.error(err)
        process.exit(1);
    }
    console.info("PM2 Connected...");
    schedule_jobs(conf.module_conf);
});

process.on('exit',() => {
    console.info("pm2 disconnect");
    pm2.disconnect()
});

function schedule_jobs(cron) {
    Object.keys(cron).forEach((job) => {
        console.log('schedule job: ', job, "cron", cron[job]);
        scheduler.scheduleJob(cron[job], () => {
            pm2.restart(job, (err, proc) => {
                if (err) {
                    console.error(`${job} job start failed.`, err);
                    return;
                }
                console.info(`${job} job started.`);
            });
        });
    });
}
