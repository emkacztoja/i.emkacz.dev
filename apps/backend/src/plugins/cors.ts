import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../env.js';

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: env.ORIGIN_FRONTEND,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    // allow admin headers used by the frontend (case-insensitive)
    allowedHeaders: ['Authorization', 'x-admin-api-key', 'Content-Type'],
    // allow credentials if frontend needs cookies / auth in the future
    credentials: true,
    // preflight cache for 1 hour
    maxAge: 3600,
  });
});
