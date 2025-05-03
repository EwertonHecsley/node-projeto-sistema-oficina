import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { CreateVehicleUseCase } from '../../../core/domain/vehicle/useCase/CeateVehicle';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';

const mockVehicleRepository = {
  findByPlate: jest.fn(),
  create: jest.fn(),
} as unknown as VehicleRepositoy;

describe('CreateVehicleUseCase', () => {
  let createVehicleUseCase: CreateVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createVehicleUseCase = new CreateVehicleUseCase(mockVehicleRepository);
  });

  it('deve criar um veículo com sucesso', async () => {
    const plate = 'ABC1234';

    mockVehicleRepository.findByPlate = jest.fn().mockResolvedValue(null);

    mockVehicleRepository.create = jest.fn().mockImplementation(async (vehicle) => vehicle);

    const result = await createVehicleUseCase.execute({ plate });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Vehicle);

    expect(mockVehicleRepository.findByPlate).toHaveBeenCalledWith(plate);
    expect(mockVehicleRepository.create).toHaveBeenCalled();

    const createdVehicleArg = (mockVehicleRepository.create as jest.Mock).mock.calls[0][0];
    expect(createdVehicleArg.properties.plate).toBe(plate);
  });

  it('deve retornar erro se a placa estiver ausente', async () => {
    const result = await createVehicleUseCase.execute({ plate: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
    expect((result.value as BadRequest).message).toBe('Placa inválida');
  });

  it('deve retornar erro se a placa já estiver cadastrada', async () => {
    const plate = 'XYZ9876';

    const existingVehicle = Vehicle.create({ plate });
    mockVehicleRepository.findByPlate = jest.fn().mockResolvedValue(existingVehicle);

    const result = await createVehicleUseCase.execute({ plate });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
    expect((result.value as BadRequest).message).toBe('Placa já cadastrada');
    expect(mockVehicleRepository.findByPlate).toHaveBeenCalledWith(plate);
  });
});
