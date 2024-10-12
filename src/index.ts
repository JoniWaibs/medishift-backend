import { envs } from "./config/envs";
import { Server } from "./infrastucture/http/server";

(() => {
    main();
  })();
  
  async function main() {
    new Server(envs.PORT).run();
  }
  