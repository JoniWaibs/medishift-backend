import { Router } from 'express';
import { MongoDBDatasource } from '../../persistance/datasource/user';
import { UserRepositoryImplementation } from '../../persistance/implementation/user';
import { signUp } from '../../../shared/utils/schemma-validator';
import { validate } from '../middlewares/validator';
import { UserController } from '../controllers/users/index.ts';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const mongoDataSource = new MongoDBDatasource();
    const userImplementation = new UserRepositoryImplementation(mongoDataSource);
    const userController = new UserController(userImplementation);

    router.post('/users/sign-up', validate(signUp), (req, res, next) => userController.signUp(req, res, next));

    // rest of routes
    // ...

    return router;
  }
}
