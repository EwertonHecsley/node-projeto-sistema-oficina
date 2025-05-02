import { Vehicle } from '../../../../core/domain/vehicle/entity/Vehicle';
import Identity from '../../../../core/generics/Identity';
import { vehicle } from '../schema';

type InsertVehicle = typeof vehicle.$inferInsert;
type SelectVehicle = typeof vehicle.$inferSelect;

export class VehicleMapper {
  static toPersistence(vehicle: Vehicle, clientId?: string): InsertVehicle {
    return {
      id: vehicle.valueId.valueId,
      plate: vehicle.plate,
      clientId: clientId,
      createdAt: new Date(),
    };
  }

  static toDomain(raw: SelectVehicle): Vehicle {
    return Vehicle.create({ plate: raw.plate }, new Identity(raw.id));
  }
}
