import { Router } from 'express';
import { MongoDBUserDatasource } from '../../../persistance/datasource';
import { UserRepositoryImplementation } from '../../../persistance/implementation';
import { AuthController } from '../../controllers/auth';
import { Validator } from '../../../../shared/utils/schemma-validator';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { validate } from '../../middlewares/validator';
import { EmailService } from '../../../services/email-service';

export class AuthRouter {
  static get routes(): Router {
    const router = Router();
    const basePath: string = '/auth';

    const emailService = new EmailService();
    const mongoUserDataSource = new MongoDBUserDatasource();
    const implementation = new UserRepositoryImplementation(mongoUserDataSource);
    const controller = new AuthController(implementation, emailService);

    const routeDefinitions = [
      { path: `${basePath}/sign-up`, method: router.post, middlewares: [validate(Validator.signUp)], handler: controller.signUp },
      { path: `${basePath}/current-user`, method: router.get, middlewares: [CurrentUserMiddleware.handleUser], handler: controller.currentUser },
      { path: `${basePath}/sign-in`, method: router.post, middlewares: [validate(Validator.signIn)], handler: controller.signIn },
      { path: `${basePath}/sign-out`, method: router.post, handler: controller.signOut },
      { path: `${basePath}/email-confirmation`, method: router.post, handler: controller.confirmEmail },
      { path: `${basePath}/forgot-password`, method: router.post, middlewares: [validate(Validator.forgotPassword)], handler: controller.forgotPassword },
      { path: `${basePath}/reset-password`, method: router.post, middlewares: [validate(Validator.resetPassword)], handler: controller.resetPassword }
    ];

    routeDefinitions.forEach(({ path, method, middlewares = [], handler }) => {
      method.bind(router)(path, ...middlewares, handler.bind(controller));
    });

    return router;
  }
}
