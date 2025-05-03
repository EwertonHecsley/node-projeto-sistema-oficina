import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { UpdateVehicleUseCase } from '../../../core/domain/vehicle/useCase/updateVehicle';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockVehicleRepository = {
  findById: jest.fn(),
  findByPlate: jest.fn(),
  update: jest.fn(),
} as unknown as VehicleRepositoy;

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updateVehicleUseCase = new UpdateVehicleUseCase(mockVehicleRepository);
  });

  it('deve atualizar o veículo com sucesso', async () => {
    const id = '123';
    const plate = 'NEW1234';
    const vehicle = Vehicle.create({ plate: 'OLD1234' });

    mockVehicleRepository.findById = jest.fn().mockResolvedValue(vehicle);
    mockVehicleRepository.findByPlate = jest.fn().mockResolvedValue(null);
    mockVehicleRepository.update = jest.fn().mockResolvedValue(true);

    const result = await updateVehicleUseCase.execute({ id, plate });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    expect(vehicle.plate).toBe(plate);
    expect(mockVehicleRepository.update).toHaveBeenCalledWith(vehicle);
  });

  it('deve retornar erro NotFound se o veículo não existir', async () => {
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(null);

    const result = await updateVehicleUseCase.execute({ id: '999', plate: 'XYZ9876' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Veiculo nao encontrado.');
    expect(mockVehicleRepository.update).not.toHaveBeenCalled();
  });

  it('deve retornar erro BadRequest se a placa já estiver cadastrada', async () => {
    const id = '123';
    const plate = 'DUPL1234';
    const vehicle = Vehicle.create({ plate: 'OLDPLATE' });
    const existingPlateVehicle = Vehicle.create({ plate });

    mockVehicleRepository.findById = jest.fn().mockResolvedValue(vehicle);
    mockVehicleRepository.findByPlate = jest.fn().mockResolvedValue(existingPlateVehicle);

    const result = await updateVehicleUseCase.execute({ id, plate });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
    expect((result.value as BadRequest).message).toBe('Placa informada já cadastrada.');
    expect(mockVehicleRepository.update).not.toHaveBeenCalled();
  });
});
