import { eq } from 'drizzle-orm';
import { Vehicle } from '../../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../../core/domain/vehicle/repository/VehicleRepository';
import { DatabaseConnection } from '../../drizzle/DatabaseConnection';
import { vehicle as vehicleSchema } from '../../drizzle/schema';
import { VehicleMapper } from '../../drizzle/mappers/VehicleMapper';

export class VehicleOrmRepository implements VehicleRepositoy {
  private database = DatabaseConnection.getInstance();

  async create(entity: Vehicle): Promise<Vehicle> {
    const data = VehicleMapper.toPersistence(entity, entity.valueId.valueId);

    const [created] = await this.database.db.insert(vehicleSchema).values(data).returning();

    return VehicleMapper.toDomain(created);
  }

  async findById(id: string): Promise<Vehicle> {
    const [found] = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.id, id));

    return VehicleMapper.toDomain(found);
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const [found] = await this.database.db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.plate, plate));

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
    const data = VehicleMapper.toPersistence(entity, entity.valueId.valueId);

    const [updated] = await this.database.db
      .update(vehicleSchema)
      .set(data)
      .where(eq(vehicleSchema.id, entity.valueId.valueId))
      .returning();

    return VehicleMapper.toDomain(updated);
  }
}
