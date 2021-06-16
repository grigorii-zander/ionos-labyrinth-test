import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { MongoError } from 'mongodb'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()
    switch (exception.code) {
      case 11000:
        res.status(HttpStatus.CONFLICT).json({ message: 'Already exist.' })
        break
      default:
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' })
    }
  }
}
