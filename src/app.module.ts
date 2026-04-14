import { Module } from '@nestjs/common';
import { ProjectsModule } from './modules/projects/projects.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsModule } from './modules/publications/publications.module';
import { TeamModule } from './modules/team/team.module';
import { JobPostsModule } from './modules/job-posts/job-posts.module';
import { JobApplicationModule } from './modules/job-application/job-application.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';


@Module({
  imports: [ AuthModule,ProjectsModule,PublicationsModule,TeamModule,
          JobPostsModule,JobApplicationModule,ContactsModule,

     // .env file globally available now
    ConfigModule.forRoot({
      isGlobal:true
    }),

    // Database connection setup
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService )=> ({

        type:'postgres',
        host:configService.get("DB_HOST"),
        port:Number(configService.get("DB_PORT")),
        username:configService.get("DB_USERNAME") ,
        password:configService.get("DB_PASSWORD")  ,
        database:configService.get("DB_NAME")  ,
        
        autoLoadEntities:true,
        synchronize:false, //in development phase: true, in production: false
        logging:true,//in development phase: true, in production false

        extra: {
        options: '-c timezone=Asia/Dhaka',
        },})

    })
   ],

  controllers: [],
  providers: [],
})
export class AppModule {}
