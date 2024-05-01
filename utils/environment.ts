export const server_config = {
  server_port: Number(process.env.SERVER_PORT) || 9000,
  MONGO_URI: process.env.MONGO_URI || '',
  BUMII_EMAIL: process.env.BUMII_EMAIL || '',
  BUMII_EMAIL_PASSWORD: process.env.BUMII_EMAIL_PASSWORD || '',
};
