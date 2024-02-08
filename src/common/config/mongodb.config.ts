import { registerAs } from '@nestjs/config';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default registerAs('mongodb', () => {
  const { DB_PORT, DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
  return {
    uri: isDevelopment
      ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
      : `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
  };
});
