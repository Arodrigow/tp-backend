import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [UsersModule,
    AccessModule,
    JwtModule.register({
      global:true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '2h' }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
