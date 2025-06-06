import { eq } from 'drizzle-orm';
import { ConsumerClient } from '../../../../core/domain/consumerClient/entity/ConsumerCLient';
import { ClientRepositoy } from '../../../../core/domain/consumerClient/repository/ClientRepository';
import { DatabaseConnection } from '../../drizzle/DatabaseConnection';
import { ConsumerClientMapper } from '../../drizzle/mappers/ConsumerClientMapper';
import { VehicleMapper } from '../../drizzle/mappers/VehicleMapper';
import {
  consumerClient as consumerClientSchema,
  vehicle as vehicleSchema,
} from '../../drizzle/schema';
import { Vehicle } from '../../../../core/domain/vehicle/entity/Vehicle';

export class ConsumerClietOrmRepository implements ClientRepositoy {
  private database = DatabaseConnection.getInstance();

  async createClient(client: ConsumerClient): Promise<ConsumerClient> {
    const data = ConsumerClientMapper.toPersistence(client);

    const [newClient] = await this.database.db
      .insert(consumerClientSchema)
      .values(data)
      .returning();

    return ConsumerClientMapper.toDomain(newClient, client.vehicles);
  }

  async getAllClients(): Promise<ConsumerClient[]> {
    const result = await this.database.db
      .select()
      .from(consumerClientSchema)
      .orderBy(consumerClientSchema.name);

    const allVehicles = await this.database.db.select().from(vehicleSchema);

    const vehiclesByClientId = allVehicles.reduce(
      (acc, vehicle) => {
        if (!vehicle.clientId) return acc;
        const clientVehicles = acc[vehicle.clientId] || [];
        acc[vehicle.clientId] = [...clientVehicles, vehicle];
        return acc;
      },
      {} as Record<string, (typeof vehicleSchema.$inferSelect)[]>,
    );

    return result.map((client) => {
      const clientVehicles = vehiclesByClientId[client.id] || [];
      const domainVehicles = clientVehicles.map(VehicleMapper.toDomain);
      return ConsumerClientMapper.toDomain(client, domainVehicles);
    });
  }

  async getClientByDocType(docType: string): Promise<ConsumerClient | null> {
    const [clientByDoc] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.docType, docType));

    if (!clientByDoc) return null;

    const vehiclesRaw = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.clientId, clientByDoc.id));

    const vehicles = vehiclesRaw.map(VehicleMapper.toDomain);
    return ConsumerClientMapper.toDomain(clientByDoc, vehicles);
  }

  async getClientByEmail(email: string): Promise<ConsumerClient | null> {
    const [clientByEmail] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.email, email));

    if (!clientByEmail) return null;

    const vehiclesRaw = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.clientId, clientByEmail.id));

    const vehicles = vehiclesRaw.map(VehicleMapper.toDomain);
    return ConsumerClientMapper.toDomain(clientByEmail, vehicles);
  }

  async getClientById(id: string): Promise<ConsumerClient | null> {
    const [clientById] = await this.database.db
      .select()
      .from(consumerClientSchema)
      .where(eq(consumerClientSchema.id, id));

    if (!clientById) {
      return null;
    }

    const vehiclesRaw = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.clientId, id));

    const vehicles = vehiclesRaw.map(VehicleMapper.toDomain);
    return ConsumerClientMapper.toDomain(clientById, vehicles);
  }

  async updateClient(id: string, client: ConsumerClient): Promise<void> {
    const data = ConsumerClientMapper.toPersistence(client, true);

    await this.database.db
      .update(consumerClientSchema)
      .set({ ...data })
      .where(eq(consumerClientSchema.id, id));
  }

  async deleteClient(id: string): Promise<void> {
    await this.database.db.delete(consumerClientSchema).where(eq(consumerClientSchema.id, id));
  }

  async addaddVehicleToClient(vehicle: Vehicle, clientId: string): Promise<void> {
    const data = VehicleMapper.toPersistence(vehicle, clientId);

    await this.database.db
      .update(vehicleSchema)
      .set({ clientId: data.clientId, plate: data.plate })
      .where(eq(vehicleSchema.id, vehicle.valueId.valueId))
      .returning();
  }
}
