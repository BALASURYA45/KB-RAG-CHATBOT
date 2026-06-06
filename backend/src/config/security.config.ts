export const securityConfig = {
  generalRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 300,
  },
  chatRateLimit: {
    windowMs: 60 * 1000,
    max: 20,
  },
  adminRateLimit: {
    windowMs: 60 * 1000,
    max: 10,
  },
  ticketRateLimit: {
    windowMs: 60 * 1000,
    max: 10,
  },
  maxQuestionLength: 2000,
  maxEmailLength: 254,
  maxSessionIdLength: 128,
};
