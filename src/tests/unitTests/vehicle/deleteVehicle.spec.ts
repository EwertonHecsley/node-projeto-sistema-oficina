import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { DeleteVehicleUseCase } from '../../../core/domain/vehicle/useCase/DelteVehicle';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockVehicleRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
} as unknown as VehicleRepositoy;

describe('DeleteVehicleUseCase', () => {
  let deleteVehicleUseCase: DeleteVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteVehicleUseCase = new DeleteVehicleUseCase(mockVehicleRepository);
  });

  it('deve deletar um veículo com sucesso se ele existir', async () => {
    const id = '123';
    const vehicle = Vehicle.create({ plate: 'XYZ1234' });

    mockVehicleRepository.findById = jest.fn().mockResolvedValue(vehicle);
    mockVehicleRepository.delete = jest.fn().mockResolvedValue(true);

    const result = await deleteVehicleUseCase.execute({ id });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    expect(mockVehicleRepository.findById).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.delete).toHaveBeenCalledWith(id);
  });

  it('deve retornar erro NotFound se o veículo não for encontrado', async () => {
    const id = '999';
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(null);

    const result = await deleteVehicleUseCase.execute({ id });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Veiculo nao encontrado.');
    expect(mockVehicleRepository.findById).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
  });
});
