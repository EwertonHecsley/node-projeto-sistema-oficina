import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { FindVehicleUseCase } from '../../../core/domain/vehicle/useCase/findVehicle';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockVehicleRepository = {
  findById: jest.fn(),
} as unknown as VehicleRepositoy;

describe('FindVehicleUseCase', () => {
  let findVehicleUseCase: FindVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    findVehicleUseCase = new FindVehicleUseCase(mockVehicleRepository);
  });

  it('deve retornar um veículo se encontrado', async () => {
    const id = 'abc-123';
    const vehicle = Vehicle.create({ plate: 'XYZ9876' });

    mockVehicleRepository.findById = jest.fn().mockResolvedValue(vehicle);

    const result = await findVehicleUseCase.execute({ id });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(vehicle);
    expect(mockVehicleRepository.findById).toHaveBeenCalledWith(id);
  });

  it('deve retornar erro NotFound se o veículo não for encontrado', async () => {
    const id = 'inexistente-456';
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(null);

    const result = await findVehicleUseCase.execute({ id });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Veículo não encontrado');
    expect(mockVehicleRepository.findById).toHaveBeenCalledWith(id);
  });
});
