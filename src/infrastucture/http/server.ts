import { type Server as ServerHttp, type IncomingMessage, type ServerResponse } from 'http';
import express, { NextFunction, Request, Response, Router } from 'express';
import cookieParser from 'cookie-parser';
import { HttpCode } from '../../core/enums';
import { AppError } from '../../shared/errors/custom.error';
import { ErrorMiddleware } from './middlewares/error';
import 'express-async-errors';

interface ServerOptions {
  port: number;
  routes: Router;
  apiPrefix: string;
}

export class Server {
  readonly app = express(); // This is  for testing purposes
  #serverListener?: ServerHttp<typeof IncomingMessage, typeof ServerResponse>;
  readonly #port: number;
  readonly #routes: Router;
  readonly #apiPrefix: string;

  constructor(options: ServerOptions) {
    const { port, routes, apiPrefix } = options;
    this.#port = port;
    this.#routes = routes;
    this.#apiPrefix = apiPrefix;
  }

  async run(): Promise<void> {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Cookie session configs
    this.app.set('trust proxy', true);
    this.app.use(cookieParser());

    // CORS
    this.app.use((req, res, next) => {
      const allowedOrigins = ['http://localhost:3000'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin!)) {
        res.setHeader('Access-Control-Allow-Origin', origin!);
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    // Routes
    this.app.use(this.#apiPrefix, this.#routes);

    this.app.get('/', (_req: Request, res: Response) => {
      return res.status(HttpCode.OK).send({
        message: `Welcome to Initial API! \n Endpoints available at http://localhost:${this.#port}/`
      });
    });

    // Handle not found routes in /api/v1/
    this.#routes.all('*', (req: Request, _: Response, next: NextFunction): void => {
      next(AppError.notFound(`Cant find ${req.originalUrl} on this server!`));
    });

    // Handle errors middleware
    this.app.use(ErrorMiddleware.handleError);

    this.#serverListener = this.app.listen(this.#port, () => {
      console.log(`Server running on port ${this.#port}...`);
    });
  }

  close(): void {
    this.#serverListener?.close();
  }
}
