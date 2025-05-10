import { eq } from 'drizzle-orm';
import { Mechanic } from '../../../../core/domain/mechanic/entity/Mechanic';
import { MechanicRepository } from '../../../../core/domain/mechanic/repository/MechanicRepository';
import { DatabaseConnection } from '../../drizzle/DatabaseConnection';
import { MechanicMapper } from '../../drizzle/mappers/MechanicMapper';
import { mechanic as mechanicSchema } from '../../drizzle/schema/mechanicSchema';

export class MechanicOrmRepository implements MechanicRepository {
  private database = DatabaseConnection.getInstance();

  async create(entity: Mechanic): Promise<Mechanic> {
    const data = MechanicMapper.toPersistence(entity);
    const [created] = await this.database.db
      .insert(mechanicSchema)
      .values({ ...data })
      .returning();

    return MechanicMapper.toDomain(created);
  }

  async findAll(): Promise<Mechanic[]> {
    const result = await this.database.db.select().from(mechanicSchema);
    return result.map(MechanicMapper.toDomain);
  }

  async findById(id: string): Promise<Mechanic | null> {
    const [mechanic] = await this.database.db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.id, id));

    if (!mechanic) {
      return null;
    }

    return MechanicMapper.toDomain(mechanic);
  }

  async findByCpf(cpf: string): Promise<Mechanic | null> {
    const [mechanic] = await this.database.db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.cpf, cpf));

    if (!mechanic) {
      return null;
    }

    return MechanicMapper.toDomain(mechanic);
  }

  async findByEmail(email: string): Promise<Mechanic | null> {
    const [mechanic] = await this.database.db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.email, email));

    if (!mechanic) {
      return null;
    }

    return MechanicMapper.toDomain(mechanic);
  }

  async update(entity: Mechanic): Promise<void> {
    const data = MechanicMapper.toPersistence(entity);
    await this.database.db
      .update(mechanicSchema)
      .set(data)
      .where(eq(mechanicSchema.id, entity.valueId.valueId));
  }

  async delete(id: string): Promise<void> {
    await this.database.db.delete(mechanicSchema).where(eq(mechanicSchema.id, id));
  }
}
