import { Router } from 'express';
import { MongoDBUserDatasource } from '../../../persistance/datasource';
import { UserRepositoryImplementation } from '../../../persistance/implementation';
import { AuthController } from '../../controllers/auth';
import { Validator } from '../../../../shared/utils/schemma-validator';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { validate } from '../../middlewares/validator';

export class AuthRouter {
  static get routes(): Router {
    const router = Router();
    const basePath: string = '/auth';

    const mongoUserDataSource = new MongoDBUserDatasource();
    const implementation = new UserRepositoryImplementation(mongoUserDataSource);
    const controller = new AuthController(implementation);

    const routeDefinitions = [
      { path: `${basePath}/sign-up`, method: router.post, middlewares: [validate(Validator.signUp)], handler: controller.signUp },
      { path: `${basePath}/current-user`, method: router.get, middlewares: [CurrentUserMiddleware.handleUser], handler: controller.currentUser },
      { path: `${basePath}/sign-in`, method: router.post, middlewares: [validate(Validator.signIn)], handler: controller.signIn },
      { path: `${basePath}/sign-out`, method: router.post, handler: controller.signOut }
    ];

    routeDefinitions.forEach(({ path, method, middlewares = [], handler }) => {
      method.bind(router)(path, ...middlewares, handler.bind(controller));
    });

    return router;
  }
}
