import { Router } from 'express';
import { MongoDBShiftDataSource } from '../../../persistance/datasource';
import { ShiftRepositoryImplementation } from '../../../persistance/implementation';
import { ShiftController } from '../../controllers/shift';
import { CurrentUserMiddleware } from '../../middlewares/current-user';
import { RequestAuthMiddleware } from '../../middlewares/request-auth';

export class ShiftRouter {
  static get routes(): Router {
    const router = Router();

    const mongoShiftDataSource = new MongoDBShiftDataSource();
    const shiftImplementation = new ShiftRepositoryImplementation(mongoShiftDataSource);
    const shiftController = new ShiftController(shiftImplementation);

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

    return router;
  }
}
