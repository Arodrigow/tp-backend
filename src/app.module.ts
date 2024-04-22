import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT,10),
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_NAME,
      entities:[__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: false,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
