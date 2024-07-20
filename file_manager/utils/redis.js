import Redis from 'ioredis';

const redisClient = new Redis();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

const redisClientWrapper = {
  isAlive: () => redisClient.status === 'ready',
  // Add other redis related functions here
};

export default redisClientWrapper;
