import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  API_PREFIX: env.get('API_PREFIX').required().asString(),
  JWT_SECRET_KEY: env.get('JWT_SECRET_KEY').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').required().asString(),

  //Mongo
  MONGO_DB_URL: env.get('MONGO_DB_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_DB_USER: env.get('MONGO_DB_USER').required().asString(),
  MONGO_DB_PASS: env.get('MONGO_DB_PASS').required().asString(),

  TIMEZONE: env.get('TIMEZONE').required().asString(),

  //Email
  MAILER_API_KEY: env.get('MAILER_API_KEY').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
  MAILER_PORT: env.get('MAILER_PORT').required().asPortNumber(),
  MAILER_SECURE: env.get('MAILER_SECURE').required().asBool(),
  MAILER_HOST: env.get('MAILER_HOST').required().asString(),
  MAILER_FROM: env.get('MAILER_FROM').required().asString(),

  FRONTEND_URL: env.get('FRONTEND_URL').required().asString(),
};
