import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const limiterIp = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: {
    error: "Terlalu banyak percobaan login, coba lagi nanti",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const limiterUser = (menit, max) =>
  rateLimit({
    windowMs: menit * 60 * 1000,
    max,
    message: {
      error: "Terlalu banyak percobaan login, coba lagi nanti",
    },
    keyGenerator: (req) => {
      if (req.user?.id) {
        return `user-${req.user.id}`;
      }

      // IPv4 & IPv6 aman
      return ipKeyGenerator(req);
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const limiterByBody = (menit, max, key, msg) =>
  rateLimit({
    windowMs: menit * 60 * 1000,
    max,
    message: {
      error: msg,
    },
    keyGenerator: (req) => {
      const identifier = req.body[key];
      return identifier ? `limit-${key}-${identifier}` : `ip-${req.ip}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
