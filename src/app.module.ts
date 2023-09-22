import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { helpers } from 'handlebars';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { MediaModule } from './media/media.module';




@Module({
  imports: [
    JwtModule.register({
      global: true,
      /* Secret has precedence over keys */
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.SMTP_USERNAME}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_DOMAIN}`,
        defaults: {
          from: '"Nova Support" <support@nova.com>',
        },
        template: {
          dir: join(process.cwd(), '/templates'),
          adapter: new HandlebarsAdapter(helpers, {
            inlineCssEnabled: true,
            /** See https://www.npmjs.com/package/inline-css#api */
            inlineCssOptions: {
              url: ' ',
              preserveMediaQueries: true,
            },
          }),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule.forRoot(),
    AuthenticationModule,
    UserModule,
    RoomModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
