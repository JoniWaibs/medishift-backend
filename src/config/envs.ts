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
  MONGO_DB_PASS: env.get('MONGO_DB_PASS').required().asString()
};
