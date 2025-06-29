var pmx     = require('pmx');

require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss.l)' });

console.info('[pm2-cron] Starting....', 'PID:', process.pid);

var conf    = pmx.initModule({
    // Override PID to be monitored
    pid  : pmx.resolvePidPaths(['/var/run/redis.pid']),
}, (err, conf) => {
    console.info("[pm2-cron] configuration =", conf);
    require('./cron.js')(conf);
});

