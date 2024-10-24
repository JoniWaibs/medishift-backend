import { Router } from 'express';
import { AuthRouter } from './auth';
import { UserRouter } from './user';
import { ShiftRouter } from './shift';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use(AuthRouter.routes);
    router.use(UserRouter.routes);
    router.use(ShiftRouter.routes);

    //TODO create doctor routes using DoctorController
    //TODO create clinic routes using ClinicController

    return router;
  }
}
