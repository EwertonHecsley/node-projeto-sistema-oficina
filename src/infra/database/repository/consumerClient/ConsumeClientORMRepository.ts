import { eq } from 'drizzle-orm';
import { ConsumerClient } from '../../../../core/domain/consumerClient/entity/ConsumerCLient';
import { ClientRepositoy } from '../../../../core/domain/consumerClient/repository/ClientRepository';
import { DatabaseConnection } from '../../drizzle/DatabaseConnection';
import { ConsumerClientMapper } from '../../drizzle/mappers/ConsumerClientMapper';
import { consumerClient as consumerClientSchema } from '../../drizzle/schema';

export class ConsumerClietOrmRepository implements ClientRepositoy {
  private database = DatabaseConnection.getInstance();

  async createClient(client: ConsumerClient): Promise<ConsumerClient> {
    const data = ConsumerClientMapper.toPersistence(client);

    const [newClient] = await this.database.db
      .insert(consumerClientSchema)
      .values(data)
      .returning();

    return ConsumerClientMapper.toDomain(newClient);
  }

  async getAllClients(): Promise<ConsumerClient[]> {
    const result = await this.database.db
      .select()
      .from(consumerClientSchema)
      .orderBy(consumerClientSchema.name);

    return result.map((element) => ConsumerClientMapper.toDomain(element));
  }

  async getClientByDocType(docType: string): Promise<ConsumerClient | null> {
    const [clientByDoc] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.docType, docType));

    return ConsumerClientMapper.toDomain(clientByDoc);
  }

  async getClientByEmail(email: string): Promise<ConsumerClient | null> {
    const [clientByEmail] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.email, email));

    return ConsumerClientMapper.toDomain(clientByEmail);
  }

  async getClientById(id: string): Promise<ConsumerClient | null> {
    const [clientById] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.id, id));

    return ConsumerClientMapper.toDomain(clientById);
  }

  async updateClient(id: string, client: ConsumerClient): Promise<void> {
    const data = ConsumerClientMapper.toPersistence(client);

    await this.database.db
      .update(consumerClientSchema)
      .set({ ...data })
      .where(eq(consumerClientSchema.id, id));
  }

  async deleteClient(id: string): Promise<void> {
    await this.database.db.delete(consumerClientSchema).where(eq(consumerClientSchema.id, id));
  }
}
