import { z } from 'zod';

export const shortenRequestSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
  // expireDays: 0 = permanent, or 1/3/7
  expireDays: z.number().int().nonnegative().optional(),
});

export type ShortenRequest = z.infer<typeof shortenRequestSchema>;
