import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    await NestFactory.createApplicationContext(AppModule);
}

bootstrap().then(() => console.log('\x1b[36m[Bot] Running...\x1b[0m'));
