import Entity from '../../../generics/Entity';

type VehicleType = {
  plate: string;
};

export class Vehicle extends Entity<VehicleType> {
  private constructor(plate: string) {
    super({ plate });
  }

  static create(plate: string): Vehicle {
    return new Vehicle(plate);
  }

  get plate(): string {
    return this.properties.plate;
  }

  set plate(plate: string) {
    this.properties.plate = plate;
  }
}
