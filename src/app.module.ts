import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino/dist'
import { CorrelationMiddleware } from 'correlation.middleware'
import { CORRELATION_ID_PROP } from 'constants/correlationId'
import { AuthModule } from 'auth/auth.module'
import { UsersModule } from 'users/users.module'
import { ConfigModule } from 'config/config.module'
import { ConfigService } from 'config/config.service'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { HashModule } from 'hash/hash.module'
import { MongoExceptionFilter } from 'filters/mongoException.filter'
import { LabyrinthModule } from 'labyrinth/labyrinth.module'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        if (!config.getValue('mongo:uri')) {
          throw new Error('Mongo URL not specified. Check API_MONGO__URI environment variable.')
        }
        return {
          connectionFactory: connection => {
            connection.plugin(schema => {
              schema.options.toObject = {
                virtuals: true,
                versionKey: false,
                transform(doc, ret) {
                  ret.id = ret._id
                  delete ret._id
                },
              }
              schema.options.toJSON = {
                virtuals: true,
                versionKey: false,
                transform(doc, ret) {
                  ret.id = ret._id
                  delete ret._id
                },
              }
            })
            return connection
          },
          uri: config.getValue('mongo:uri'),
          autoIndex: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          prettyPrint:
            process.env.NODE_ENV === 'development'
              ? {
                  colorize: true,
                  ignore: 'hostname',
                  translateTime: 'dd/mm/yyyy, HH:MM:ss TT',
                }
              : false,
          genReqId: req => {
            return req[CORRELATION_ID_PROP]
          },
        },
        process.stdout,
      ],
    }),
    AuthModule,
    UsersModule,
    HashModule,
    LabyrinthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule implements NestModule {
  public readonly port: number
  constructor(private config: ConfigService) {
    this.port = parseInt(config.getValue('app:port'), 10)
    if (!this.port) {
      throw new Error('Application port not specified or value is invalid, check API_APP__PORT env variable.')
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationMiddleware).forRoutes('*')
  }
}
