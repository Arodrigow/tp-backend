import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WellsModule } from './wells/wells.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ActivitiesModule } from './activities/activities.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [
    UsersModule,
    WellsModule,
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
      autoLoadEntities: true
    }),
    AuthModule,
    MonitoringModule,
    ActivitiesModule,
    AccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
