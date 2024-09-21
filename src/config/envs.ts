import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  API_PREFIX: env.get('API_PREFIX').required().asString(),

  //Mongo
  MONGO_DB_URL: env.get('MONGO_DB_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_DB_USER: env.get('MONGO_DB_USER').required().asString(),
  MONGO_DB_PASS: env.get('MONGO_DB_PASS').required().asString()
};
