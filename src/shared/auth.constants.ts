export const JWT_CONSTANTS = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-here',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
