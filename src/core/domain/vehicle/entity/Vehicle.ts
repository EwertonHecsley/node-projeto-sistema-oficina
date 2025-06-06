import Entity from '../../../generics/Entity';
import Identity from '../../../generics/Identity';

type VehicleType = {
  plate: string;
  clientId?: string;
};

export class Vehicle extends Entity<VehicleType> {
  private constructor(props: VehicleType, id?: Identity) {
    super(props, id);
  }

  static create(props: VehicleType, id?: Identity): Vehicle {
    return new Vehicle(props, id);
  }

  get plate(): string {
    return this.properties.plate;
  }

  set plate(plate: string) {
    this.properties.plate = plate;
  }

  get clientId() {
    return this.properties.clientId!;
  }

  set clientId(clientId: string) {
    this.properties.clientId = clientId;
  }
}
