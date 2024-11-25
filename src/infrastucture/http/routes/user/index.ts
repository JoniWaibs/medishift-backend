import { Router } from 'express';
import { Validator } from '../../../../shared/utils/schemma-validator';
import { MongoDBUserDatasource } from '../../../persistance/datasource';
import { UserRepositoryImplementation } from '../../../persistance/implementation';
import { DoctorController, PatientController } from '../../controllers/user';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { RequestAuthMiddleware } from '../../middlewares/request-auth';
import { validate } from '../../middlewares/validator';

export class UserRouter {
  static get routes(): Router {
    const router = Router();
    const basePath: string = '/user';

    const mongoUserDataSource = new MongoDBUserDatasource();
    const implementation = new UserRepositoryImplementation(mongoUserDataSource);
    const controller = new PatientController(implementation);
    const doctorController = new DoctorController(implementation);

    router.use(CurrentUserMiddleware.handleUser);

    const routeDefinitions = [
      { path: `${basePath}/patient/create`, method: router.post, middlewares: [validate(Validator.patient), RequestAuthMiddleware.handleBasic], handler: controller.create },
      { path: `${basePath}/patient`, method: router.get, middlewares: [RequestAuthMiddleware.handleBasic], handler: controller.search },
      { path: `${basePath}/patient/update/:id`, method: router.put, middlewares: [validate(Validator.patient), RequestAuthMiddleware.handleBasic], handler: controller.update },
      { path: `${basePath}/patient/delete/:id`, method: router.delete, middlewares: [RequestAuthMiddleware.handleBasic], handler: controller.delete },
      
      { path: `${basePath}/doctor/update-many`, method: router.post, middlewares: [RequestAuthMiddleware.handleAdmin], handler: doctorController.updateMany },
      { path: `${basePath}/doctor/update/:id`, method: router.put, middlewares: [RequestAuthMiddleware.handleAdmin], handler: doctorController.update }
    ];

    routeDefinitions.forEach(({ path, method, middlewares = [], handler }) => {
      method.bind(router)(path, ...middlewares, handler.bind(controller));
    });

    return router;
  }
}
