import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { VehicleRepositoy } from '../../../core/domain/vehicle/repository/VehicleRepository';
import { WorkshopService } from '../../../core/domain/workshopService/entity/WorkshopService';
import { StatusServico } from '../../../core/domain/workshopService/enum/status';
import { WorkshoServiceRepository } from '../../../core/domain/workshopService/repository/WorkshopServiceRepository';
import { CreateWorkshopServiceUseCase } from '../../../core/domain/workshopService/useCase/CreateWorkshopService';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockWorkshopService = {
  create: jest.fn(),
  findById: jest.fn(),
} as unknown as WorkshoServiceRepository;

const mockVehicleRepository = {
  findById: jest.fn(),
} as unknown as VehicleRepositoy;

const mockMechanicRepository = {
  findById: jest.fn(),
} as unknown as MechanicRepository;

describe('Create', () => {
  let createWorkshopService: CreateWorkshopServiceUseCase;

  beforeEach(() => {
    jest.clearAllMocks(),
      (createWorkshopService = new CreateWorkshopServiceUseCase(
        mockWorkshopService,
        mockMechanicRepository,
        mockVehicleRepository,
      ));
  });

  it('Deve criar um novo servico.', async () => {
    const mockService = WorkshopService.create({
      description: 'Troca de oleo',
      cost: 300,
      mechanicId: 'id-mechanic-valid',
      vehicleId: 'id-vehicle-valid',
      estimatedTimeMinutes: 60,
      openDate: new Date(),
      status: StatusServico.ABERTO,
      closeDate: null,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(true);
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(true);
    mockWorkshopService.create = jest.fn().mockResolvedValue(mockService);

    const result = await createWorkshopService.execute({
      description: 'Troca de oleo',
      cost: 300,
      mechanicId: 'id-mechanic-valid',
      vehicleId: 'id-vehicle-valid',
      estimatedTimeMinutes: 60,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(WorkshopService);
  });

  it('Deve retornar erro se o mecânico não for encontrado.', async () => {
    mockMechanicRepository.findById = jest.fn().mockResolvedValue(null);
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(true);

    const result = await createWorkshopService.execute({
      description: 'Revisão geral',
      cost: 500,
      mechanicId: 'id-mecanico-invalido',
      vehicleId: 'id-vehicle-valid',
      estimatedTimeMinutes: 120,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as NotFound).message).toBe('Mecanico nao encontrado para esse servico.');
  });

  it('Deve retornar erro se o veículo não for encontrado.', async () => {
    mockMechanicRepository.findById = jest.fn().mockResolvedValue(true);
    mockVehicleRepository.findById = jest.fn().mockResolvedValue(null);

    const result = await createWorkshopService.execute({
      description: 'Alinhamento e balanceamento',
      cost: 150,
      mechanicId: 'id-mechanic-valid',
      vehicleId: 'id-veiculo-invalido',
      estimatedTimeMinutes: 45,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as NotFound).message).toBe('Veiculo nao encontrado para esse servico.');
  });
});
