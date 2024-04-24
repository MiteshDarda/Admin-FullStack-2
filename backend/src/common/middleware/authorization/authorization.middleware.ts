import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthorizationMiddleware.name);
  use(req: any, res: any, next: () => void) {
    next();
  }
}
