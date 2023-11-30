import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SellerModule } from './seller/seller.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    // graphql endpoint => /graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    SellerModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
