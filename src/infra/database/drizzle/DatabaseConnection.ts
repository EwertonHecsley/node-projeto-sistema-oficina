import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { logger } from '../../../shared/utils/logger';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  public db: ReturnType<typeof drizzle>;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, {
      logger: true,
      schema,
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
      logger.info('🟡  Database connection initialized');
    }

    return DatabaseConnection.instance;
  }

  public async closeConnection() {
    await this.pool.end();
    logger.info('🔴  Database connection closed');
  }

  public async checkConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1'); // comando leve e rápido
      client.release();
      logger.info('🟢  Database connected successfully');
    } catch (error) {
      logger.error('🔴  Failed to connect to the database', error);
      throw error;
    }
  }
}
