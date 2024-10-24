import { Router } from "express";
import { MongoDBUserDatasource } from "../../../persistance/datasource";
import { UserRepositoryImplementation } from "../../../persistance/implementation";
import { AuthController } from "../../controllers/auth";
import { Validator } from "../../../../shared/utils/schemma-validator";
import { CurrentUserMiddleware } from "../../middlewares/current-user";
import { validate } from "../../middlewares/validator";

export class AuthRouter {
    static get routes(): Router {
        const router = Router();

        const mongoUserDataSource = new MongoDBUserDatasource();
        const userImplementation = new UserRepositoryImplementation(mongoUserDataSource);
        const authController = new AuthController(userImplementation);

        router.post('/auth/sign-up', validate(Validator.signUp), (req, res, next) => authController.signUp(req, res, next));
        router.get('/auth/current-user', CurrentUserMiddleware.handleUser, (req, res) =>
            authController.currentUser(req, res)
        );
        router.post('/auth/sign-in', validate(Validator.signIn), (req, res) => authController.signIn(req, res));
        router.post('/auth/sign-out', (req, res) => authController.signOut(req, res));

        return router;
    }
}