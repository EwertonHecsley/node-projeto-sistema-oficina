import { eq } from 'drizzle-orm';
import { Vehicle } from '../../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../../core/domain/vehicle/repository/VehicleRepository';
import { DatabaseConnection } from '../../drizzle/DatabaseConnection';
import { vehicle as vehicleSchema } from '../../drizzle/schema';
import { VehicleMapper } from '../../drizzle/mappers/VehicleMapper';

export class VehicleOrmRepository implements VehicleRepositoy {
  private database = DatabaseConnection.getInstance();

  async create(entity: Vehicle): Promise<Vehicle> {
    const data = VehicleMapper.toPersistence(entity);
    const [created] = await this.database.db
      .insert(vehicleSchema)
      .values({ ...data })
      .returning();

    return VehicleMapper.toDomain(created);
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    const [found] = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.id, id));

    if (!found) {
      return undefined;
    }

    return VehicleMapper.toDomain(found);
  }

  async findByPlate(plate: string): Promise<Vehicle | undefined> {
    const [found] = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.plate, plate));

    if (!found) {
      return undefined;
    }

    return VehicleMapper.toDomain(found);
  }

  async findAll(): Promise<Vehicle[]> {
    const result = await this.database.db.select().from(vehicleSchema);
    return result.map(VehicleMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.database.db.delete(vehicleSchema).where(eq(vehicleSchema.id, id));
  }

  async update(entity: Vehicle): Promise<Vehicle> {
    const data = VehicleMapper.toPersistence(entity);

    const [updated] = await this.database.db
      .update(vehicleSchema)
      .set(data)
      .where(eq(vehicleSchema.id, entity.valueId.valueId))
      .returning();

    return VehicleMapper.toDomain(updated);
  }

  async addVehicleToClient(vehicle: Vehicle, clientId: string): Promise<void> {
    const data = VehicleMapper.toPersistence(vehicle, clientId);

    await this.database.db.insert(vehicleSchema).values(data);
  }
}
