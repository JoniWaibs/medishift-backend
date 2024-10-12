import { Router } from 'express';
import { MongoDBUserDatasource } from '../../persistance/datasource/user';
import { UserRepositoryImplementation } from '../../persistance/implementation/user';
import { Validator } from '../../../shared/utils/schemma-validator';
import { validate } from '../middlewares/validator';
import { AuthController } from '../controllers/auth';
import { CurrentUserMiddleware } from '../middlewares/current-user';
import { RequestAuthMiddleware } from '../middlewares/request-auth';
import { PatientController } from '../controllers/user';
import { MongoDBShiftDataSource } from '../../persistance/datasource';
import { ShiftRepositoryImplementation } from '../../persistance/implementation';
import { ShiftController } from '../controllers/shift';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const mongoUserDataSource = new MongoDBUserDatasource();
    const userImplementation = new UserRepositoryImplementation(mongoUserDataSource);
    const authController = new AuthController(userImplementation);
    const patientController = new PatientController(userImplementation);

    const mongoShiftDataSource = new MongoDBShiftDataSource();
    const shiftImplementation = new ShiftRepositoryImplementation(mongoShiftDataSource);
    const shiftController = new ShiftController(shiftImplementation);

    // Auth routes
    router.post('/auth/sign-up', validate(Validator.signUp), (req, res, next) => authController.signUp(req, res, next));
    router.get('/auth/current-user', CurrentUserMiddleware.handleUser, (req, res) =>
      authController.currentUser(req, res)
    );
    router.get('/auth/sign-in', validate(Validator.signIn), (req, res) => authController.signIn(req, res));
    router.post('/auth/sign-out', (req, res) => authController.signOut(req, res));

    // User routes
    router.post(
      '/user/patient/create',
      validate(Validator.patient),
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.create(req, res, next)
    );
    router.get(
      '/user/patient/profile/:id',
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.getById(req, res, next)
    );
    router.get('/user/patient/all', CurrentUserMiddleware.handleUser, (req, res, next) =>
      patientController.getAll(req, res, next)
    );
    router.put(
      '/user/patient/update/:id',
      validate(Validator.patient),
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.update(req, res, next)
    );
    router.delete(
      '/user/patient/delete/:id',
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => patientController.delete(req, res, next)
    );

    //medical shift routes
    router.post(
      '/shift/create',
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => shiftController.create(req, res, next)
    );
    router.get('/shift/all', CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic, (req, res, next) =>
      shiftController.findAllByDate(req, res, next)
    );
    router.get('/shift/:id', CurrentUserMiddleware.handleUser, RequestAuthMiddleware.handleBasic, (req, res, next) =>
      shiftController.getById(req, res, next)
    );
    router.put(
      '/shift/update/:id',
      CurrentUserMiddleware.handleUser,
      RequestAuthMiddleware.handleBasic,
      (req, res, next) => shiftController.update(req, res, next)
    );

    //TODO create doctor routes using DoctorController
    //TODO create clinic routes using ClinicController

    return router;
  }
}
