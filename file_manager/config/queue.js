const Queue = require('bull');
const fileQueue = new Queue('fileQueue', {
    redis: {
        host: 'localhost',
        port: 6379
    }
});

module.exports = fileQueue;