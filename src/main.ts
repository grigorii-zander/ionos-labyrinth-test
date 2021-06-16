import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import passport from 'passport'
import { version, name, description } from '../package.json'
import { Logger } from '@nestjs/common'
import ip from 'ip'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const appInstance = app.get(AppModule)
  const port = appInstance.port
  const swaggerPath = '/api'

  app.use(passport.initialize())
  app.use(cookieParser())

  const options = new DocumentBuilder().setTitle(name).setDescription(description).setVersion(version).build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(swaggerPath, app, document)
  await app.listen(4000)
  Logger.log(`Listening on http://0.0.0.0:${port}`)
  Logger.log(`Listening on http://${ip.address()}:${port}`)
  Logger.log(`Swagger available at http://0.0.0.0:${port}${swaggerPath}`)
  Logger.log(`Swagger available at http://${ip.address()}:${port}${swaggerPath}`)
}

bootstrap()
