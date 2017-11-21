import bluebird from 'bluebird';

const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.on('error', function (err) {
    console.log('Error ' + err);
});

export default (() => client);
