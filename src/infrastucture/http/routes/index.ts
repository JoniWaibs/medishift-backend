import { Router } from 'express';
import { MongoDBDatasource } from '../../persistance/datasource/user';
import { UserRepositoryImplementation } from '../../persistance/implementation/user';
import { signUp } from '../../../shared/utils/schemma-validator';
import { validate } from '../middlewares/validator';
import { AuthController } from '../controllers/auth';
import { currentUserMiddleware } from '../middlewares/current-user';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const mongoDataSource = new MongoDBDatasource();
    const userImplementation = new UserRepositoryImplementation(mongoDataSource);
    const authController = new AuthController(userImplementation);

    router.post('/auth/sign-up', validate(signUp), (req, res, next) => authController.signUp(req, res, next));
    router.get('/auth/current-user', currentUserMiddleware, (req, res) => authController.currentUser(req, res));

    // rest of routes
    // ...

    return router;
  }
}
