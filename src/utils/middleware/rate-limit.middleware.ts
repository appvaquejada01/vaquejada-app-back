import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  message: 'Muitas requisicoes deste IP, tente novamente mais tarde.',
  skip: (req) => req.path.startsWith('/webhooks/mp'),
});
