import { WorkshopService } from '../../../core/domain/workshopService/entity/WorkshopService';
import { StatusServico } from '../../../core/domain/workshopService/enum/status';
import { WorkshoServiceRepository } from '../../../core/domain/workshopService/repository/WorkshopServiceRepository';
import { ListAllWorkshopService } from '../../../core/domain/workshopService/useCase/ListAllWorkshopService';

const mockWorkshopReposiory = {
  findAll: jest.fn(),
} as unknown as WorkshoServiceRepository;

describe('ListAllWorkshopService', () => {
  let listAllWorkshopService: ListAllWorkshopService;

  beforeEach(() => {
    jest.clearAllMocks(),
      (listAllWorkshopService = new ListAllWorkshopService(mockWorkshopReposiory));
  });

  it('Deve listar todos os Servicos cadastrados.', async () => {
    const listWorkshop = WorkshopService.create({
      description: 'Servico de Troca de Oleo',
      cost: 100,
      estimatedTimeMinutes: 30,
      mechanicId: '123456789',
      openDate: new Date(),
      status: StatusServico.ABERTO,
      vehicleId: '123456789',
      closeDate: null,
    });

    mockWorkshopReposiory.listAll = jest.fn().mockResolvedValue(listWorkshop);

    const result = await listAllWorkshopService.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(listWorkshop);
    expect(mockWorkshopReposiory.listAll).toHaveBeenCalled();
  });

  it('Deve retornar um array vazio se nao houver servicos.', async () => {
    mockWorkshopReposiory.listAll = jest.fn().mockResolvedValue([]);

    const result = await listAllWorkshopService.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([]);
    expect(mockWorkshopReposiory.listAll).toHaveBeenCalled();
  });
});
