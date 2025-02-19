import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email-service';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Users, UsersSchema } from './schema/user.schema';
import { Corporate, CorporateSchema } from './schema/corporate.schema';

@Module({
  imports: [
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Corporate.name, schema: CorporateSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || '4oei89504hgmndtiimmgbnshgj',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, JwtStrategy],
})
export class UserModule {}
