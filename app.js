const util = require('util');
util._extend = Object.assign;

var pmx     	= require('pmx');
var pm2     	= require('pm2');
var scheduler	= require('node-schedule');
const registrationTime = Date.now();

require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss.l)' });

var conf = pmx.initModule({});

pm2.connect(function(err) {
    if (err) {
        console.error(err)
        process.exit(1);
    }
    console.info("PM2 Connected...");
    if (conf && conf.module_conf) {
        schedule_jobs(conf.module_conf);
    } else {
        console.error("No module configuration found.");
    }
});

process.on('exit',() => {
    console.info("pm2 disconnect");
    pm2.disconnect()
});

function schedule_jobs(cron) {
    Object.keys(cron).forEach((job) => {
        console.log('schedule job: ', job, "cron", cron[job]);
        scheduler.scheduleJob(cron[job], () => {
            if (Date.now() - registrationTime < 5000) {
                console.info(`${job} skip initial run`);
                return;
            }
            pm2.describe(job, (err, proc) => {
                if (proc && proc.length > 0 && proc[0].pm2_env) {
                    const status = proc[0].pm2_env.status;
                    if (status === 'online' || status === 'launching') {
                        console.warn(`${job} already running. skip.`);
                        return;
                    }
                }

                pm2.start(job, (err, proc) => {
                    if (err) {
                        console.error(`${job} job start failed.`, err);
                        return;
                    }
                    console.info(`${job} job started.`);
                });
            });
        });
    });
}
