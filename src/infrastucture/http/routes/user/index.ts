import { Router } from 'express';
import { Validator } from '../../../../shared/utils/schemma-validator';
import { MongoDBUserDatasource } from '../../../persistance/datasource';
import { UserRepositoryImplementation } from '../../../persistance/implementation';
import { PatientController } from '../../controllers/user';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { RequestAuthMiddleware } from '../../middlewares/request-auth';
import { validate } from '../../middlewares/validator';

export class UserRouter {
  static get routes(): Router {
    const router = Router();

    const mongoUserDataSource = new MongoDBUserDatasource();
    const implementation = new UserRepositoryImplementation(mongoUserDataSource);
    const controller = new PatientController(implementation);

    router.use(CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic);

    const routeDefinitions = [
      { path: '/user/patient/create', method: router.post, middlewares: [validate(Validator.patient)], handler: controller.create },
      { path: '/user/patient', method: router.get, handler: controller.search },
      { path: '/user/patient/update/:id', method: router.put, middlewares: [validate(Validator.patient)], handler: controller.update },
      { path: '/user/patient/delete/:id', method: router.delete, handler: controller.delete },
    ];

    routeDefinitions.forEach(({ path, method, middlewares = [], handler }) => {
      method.bind(router)(path, ...middlewares, handler.bind(controller));
    });

    return router;
  }
}
