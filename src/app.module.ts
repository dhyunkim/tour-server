import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { TourModule } from './tour/tour.module';
import { TourHolidayModule } from './tour-holiday/tour-holiday.module';
import { TourReservationModule } from './tour-reservation/tour-reservation.module';

@Module({
  imports: [
    // graphql endpoint => /graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migration/*.{ts,js}'],
        }),
    }),
    TourModule,
    TourHolidayModule,
    TourReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
