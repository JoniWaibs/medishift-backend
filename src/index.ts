import { envs } from './config/envs';
import { AppRoutes } from './infrastucture/http/routes';
import { Server } from './infrastucture/http/server';
import { MongoDDBB } from './infrastucture/persistance/database/mongo';

(() => {
  main();
})();

async function main() {
  await MongoDDBB.connect({ url: envs.MONGO_DB_URL, dbName: envs.MONGO_DB_NAME });

  new Server({
    port: envs.PORT,
    apiPrefix: envs.API_PREFIX,
    routes: AppRoutes.routes
  }).run();
}
