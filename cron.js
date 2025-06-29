const pm2 = require('pm2');
const schedule = require('node-schedule');

pm2.connect(function(err) {
    if (err) {
        console.error(err)
        process.exit(1);
    }
    console.info("PM2 Connected...");
});

process.on('exit',() => {
    console.info("pm2 disconnect");
    // Disconnects from PM2
    pm2.disconnect()
});

module.exports = function(conf) {
    let cron = conf.module_conf;

    Object.keys(cron).forEach((job) => {
        console.log('schedule job: ', job, "cron", cron[job]);
        schedule.scheduleJob(cron[job], () => {
            pm2.restart(job, (err, proc) => {
                if (err) {
                    console.error(`${job} job start failed.`, err);
                    return;
                }
                console.info(`${job} job started.`);
            });
        });
    });
};

