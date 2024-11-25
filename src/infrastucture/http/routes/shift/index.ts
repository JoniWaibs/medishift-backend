import { Router } from 'express';
import { MongoDBShiftDataSource } from '../../../persistance/datasource';
import { ShiftRepositoryImplementation } from '../../../persistance/implementation';
import { ShiftController } from '../../controllers/shift';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { RequestAuthMiddleware } from '../../middlewares/request-auth';

export class ShiftRouter {
  static get routes(): Router {
    const router = Router();
    const basePath: string = '/shift';

    const mongoShiftDataSource = new MongoDBShiftDataSource();
    const implementation = new ShiftRepositoryImplementation(mongoShiftDataSource);
    const controller = new ShiftController(implementation);

    router.use(CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic);

    const routeDefinitions = [
      { path: `${basePath}/create`, method: router.post, handler: controller.create },
      { path: `${basePath}`, method: router.get, handler: controller.search },
      { path: `${basePath}/update/:id`, method: router.put, handler: controller.update }
    ];

    routeDefinitions.forEach(({ path, method, handler }) => {
      method.bind(router)(path, handler.bind(controller));
    });

    return router;
  }
}
