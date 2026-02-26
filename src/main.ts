import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true
    })
  )

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`🚀 Started at http://localhost:${port}`)
}

bootstrap()
