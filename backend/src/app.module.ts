import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from './common/middleware/authorization/authorization.middleware';
import { AuthGuard } from './guards/auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from './database/all-entities';
import { allModules } from './common/utils/all-modules';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(allEntities),
    ...allModules,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PW,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
  exports: [AppService, TypeOrmModule.forFeature(allEntities)],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('*');
  }
}
