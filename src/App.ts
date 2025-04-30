import app from '.';
import EnvironmentValidator from './shared/utils/EnviromentValidate';
import { logger } from './shared/utils/logger';

export class App {
  private readonly port = Number(process.env.PORT);

  async bootstrap() {
    this.validate();
    this.startServer();
    this.handleGracefulShutdown();
  }

  private async startServer() {
    await app.listen({ port: this.port });
    logger.info(`🟢  Server is running on port ${this.port}`);
  }

  private validate() {
    new EnvironmentValidator().validateEnvironmentVariables();
  }

  private handleGracefulShutdown() {
    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await app.close();
      process.exit(0);
    });
  }
}
