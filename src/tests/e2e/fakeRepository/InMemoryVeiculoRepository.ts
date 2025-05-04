import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';

export class InMemoryVeiculoRepository implements VehicleRepositoy {
  public veiculos: Vehicle[] = [];

  async create(veiculo: Vehicle): Promise<Vehicle> {
    const newVehicle = Vehicle.create(veiculo);
    this.veiculos.push(newVehicle);
    return newVehicle;
  }

  async findByPlate(placa: string): Promise<Vehicle | undefined> {
    return this.veiculos.find((v) => v.plate === placa) ?? undefined;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.veiculos;
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    const vehicle = this.veiculos.find((v) => v.valueId.valueId == id);

    return vehicle;
  }

  async delete(id: string): Promise<void> {
    const index = this.veiculos.findIndex((element) => element.valueId.valueId == id);

    this.veiculos.splice(index, 1);
  }

  async update(entity: Vehicle): Promise<Vehicle> {
    const data = Vehicle.create(entity);
    const index = this.veiculos.findIndex(
      (element) => element.valueId.valueId == entity.valueId.valueId,
    );
    const updated = (this.veiculos[index] = data);

    return updated;
  }
}
