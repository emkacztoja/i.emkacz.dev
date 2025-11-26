import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify) => {
  // If DISABLE_RATE_LIMIT=true, skip registering the rate limit plugin
  if (process.env.DISABLE_RATE_LIMIT === 'true') {
    fastify.log.info('Rate limiting disabled via DISABLE_RATE_LIMIT env var');
    return;
  }

  await fastify.register(rateLimit, {
    max: 5,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', '::1'],
    redis: fastify.redis,
  });
});
