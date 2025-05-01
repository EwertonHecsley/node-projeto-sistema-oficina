import { Vehicle } from '../../core/domain/vehicle/entity/Vehicle';
import Identity from '../../core/generics/Identity';

describe('Vehicle Entity', () => {
  it('deve criar um veículo com placa corretamente', () => {
    const plate = 'ABC1234';
    const vehicle = Vehicle.create({ plate });

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.plate).toBe(plate);
  });

  it('deve alterar a placa com sucesso usando o setter', () => {
    const vehicle = Vehicle.create({ plate: 'OLD1234' });
    vehicle.plate = 'NEW5678';

    expect(vehicle.plate).toBe('NEW5678');
  });

  it('deve manter o id se fornecido', () => {
    const customId = new Identity('123e4567-e89b-12d3-a456-426614174000');
    const vehicle = Vehicle.create({ plate: 'XYZ9999' }, customId);

    expect(vehicle.valueId).toEqual(customId);
  });

  it('deve gerar um id automaticamente se não for fornecido', () => {
    const vehicle = Vehicle.create({ plate: 'AUTO123' });

    expect(vehicle.valueId).toBeDefined();
  });
});
