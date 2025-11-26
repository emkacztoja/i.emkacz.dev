import type { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';

const TTL_SECONDS = 60 * 60; // 1 hour cache

export const createShortUrl = async (
  fastify: FastifyInstance,
  originalUrl: string,
  customAlias?: string,
  expireDays?: number
) => {
  const shortId = customAlias ?? nanoid(8);
  const existing = await fastify.prisma.url.findUnique({ where: { shortId } });
  if (existing) {
    throw fastify.httpErrors.conflict('Alias already exists');
  }

  let expiresAt = undefined as undefined | Date;
  if (typeof expireDays === 'number' && expireDays > 0) {
    expiresAt = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000);
  }

  const url = await fastify.prisma.url.create({
    data: { shortId, originalUrl, expiresAt },
  });
  // ioredis: set(key, value, 'EX', seconds)
  await fastify.redis.set(shortId, originalUrl, 'EX', TTL_SECONDS);
  return url;
};

export const resolveShortUrl = async (fastify: FastifyInstance, shortId: string) => {
  const cached = await fastify.redis.get(shortId);
  if (cached) {
    // when cached, assume active and increment clicks in DB
    await fastify.prisma.url.update({
      where: { shortId },
      data: { clicks: { increment: 1 } },
    });
    return cached;
  }
  const url = await fastify.prisma.url.findUnique({ where: { shortId } });
  if (!url) return null;
  // Respect isActive flag and expiresAt
  if (url.isActive === false) return null;
  if (url.expiresAt && url.expiresAt.getTime() <= Date.now()) return null;
  await fastify.redis.set(shortId, url.originalUrl, 'EX', TTL_SECONDS);
  await fastify.prisma.url.update({
    where: { shortId },
    data: { clicks: { increment: 1 } },
  });
  return url.originalUrl;
};
