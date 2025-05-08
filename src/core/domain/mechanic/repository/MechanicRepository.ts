import { Mechanic } from '../entity/Mechanic';

export abstract class MechanicRepository {
  abstract create(entity: Mechanic): Promise<Mechanic>;
  abstract findByEmail(email: string): Promise<Mechanic | null>;
  abstract findByCpf(cpf: string): Promise<Mechanic | null>;
  abstract findAll(): Promise<Mechanic[]>;
  abstract findById(id: string): Promise<Mechanic | null>;
  abstract delete(id: string): Promise<void>;
}
