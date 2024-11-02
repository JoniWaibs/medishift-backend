import { Router } from 'express';
import { AuthRouter } from './auth';
import { UserRouter } from './user';
import { ShiftRouter } from './shift';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const routeModules = [
      AuthRouter.routes,
      UserRouter.routes,
      ShiftRouter.routes
      // DoctorRouter.routes, // Add this line once DoctorRouter is implemented
      // ClinicRouter.routes, // Add this line once ClinicRouter is implemented
    ];

    // Register each route module
    routeModules.forEach((route) => router.use(route));

    return router;
  }
}
