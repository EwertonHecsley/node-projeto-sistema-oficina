import { Vehicle } from '../entity/Vehicle';

export abstract class VehicleRepositoy {
  abstract create(entity: Vehicle): Promise<Vehicle>;
  abstract findById(id: string): Promise<Vehicle | undefined>;
  abstract findByPlate(plate: string): Promise<Vehicle | undefined>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract update(entity: Vehicle): Promise<Vehicle>;
  abstract delete(id: string): Promise<void>;
}
