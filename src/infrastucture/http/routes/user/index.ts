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
    const userImplementation = new UserRepositoryImplementation(mongoUserDataSource);
    const patientController = new PatientController(userImplementation);

    // User routes
    router.post(
      '/user/patient/create',
      validate(Validator.patient),
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.create(req, res, next)
    );

    // Search patient by id or identification number or name or email, lastname or any combination of these
    router.get('/user/patient', CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic, (req, res, next) =>
      patientController.search(req, res, next)
    );

    router.put(
      '/user/patient/update/:id',
      validate(Validator.patient),
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.update(req, res, next)
    );
    
    router.delete('/user/patient/delete/:id', CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic, (req, res, next) =>
      patientController.delete(req, res, next)
    );

    return router;
  }
}
