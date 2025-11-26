import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  // run cleanup every 15 minutes by default
  const intervalMs = Number(process.env.CLEANUP_INTERVAL_MS ?? 15 * 60 * 1000);
  const cleanup = async () => {
    try {
      const res = await fastify.prisma.url.deleteMany({
        where: {
          expiresAt: { lte: new Date() },
        },
      });
      if (res.count > 0) {
        fastify.log.info(`Cleanup: deleted ${res.count} expired URLs`);
      }
    } catch (err) {
      fastify.log.error('Cleanup error', err);
    }
  };

  const timer = setInterval(cleanup, intervalMs);
  // run immediately on startup
  await cleanup();

  fastify.addHook('onClose', async () => {
    clearInterval(timer);
  });
});

