import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { ListAllVehiclesUseCase } from '../../../core/domain/vehicle/useCase/LisAllVehicles';

const mockVehicleRepository = {
  findAll: jest.fn(),
} as unknown as VehicleRepositoy;

describe('ListAllVehiclesUseCase', () => {
  let listAllVehiclesUseCase: ListAllVehiclesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listAllVehiclesUseCase = new ListAllVehiclesUseCase(mockVehicleRepository);
  });

  it('deve retornar uma lista de veículos', async () => {
    const vehicles = [Vehicle.create({ plate: 'AAA1234' }), Vehicle.create({ plate: 'BBB5678' })];
    mockVehicleRepository.findAll = jest.fn().mockResolvedValue(vehicles);

    const result = await listAllVehiclesUseCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(vehicles);
    expect(mockVehicleRepository.findAll).toHaveBeenCalled();
  });

  it('deve retornar um array vazio se não houver veículos', async () => {
    mockVehicleRepository.findAll = jest.fn().mockResolvedValue([]);

    const result = await listAllVehiclesUseCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([]);
    expect(mockVehicleRepository.findAll).toHaveBeenCalled();
  });
});
