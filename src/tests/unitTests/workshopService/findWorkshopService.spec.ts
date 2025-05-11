import { FindWorkshopServiceUseCase } from "../../../core/domain/workshopService/useCase/FindWorkshopService";
import { WorkshopService } from "../../../core/domain/workshopService/entity/WorkshopService";
import { StatusServico } from "../../../core/domain/workshopService/enum/status";
import { WorkshoServiceRepository } from "../../../core/domain/workshopService/repository/WorkshopServiceRepository";
import { NotFound } from "../../../shared/errors/custom/NotFound";

const mockWorkshopRepository = {
    findById: jest.fn()
} as unknown as WorkshoServiceRepository;

describe('FindWorkshopServiceUseCase', () => {
    let useCase: FindWorkshopServiceUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new FindWorkshopServiceUseCase(mockWorkshopRepository);
    });

    it('Deve retornar o serviço quando encontrado.', async () => {
        const service = WorkshopService.create({
            description: 'Troca de óleo',
            cost: 250,
            mechanicId: 'mech-id',
            vehicleId: 'veh-id',
            estimatedTimeMinutes: 45,
            openDate: new Date(),
            closeDate: null,
            status: StatusServico.ABERTO
        });

        mockWorkshopRepository.findById = jest.fn().mockResolvedValue(service);

        const result = await useCase.execute({ id: 'valid-id' });

        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(WorkshopService);
    });

    it('Deve retornar erro quando o serviço não for encontrado.', async () => {
        mockWorkshopRepository.findById = jest.fn().mockResolvedValue(null);

        const result = await useCase.execute({ id: 'invalid-id' });

        expect(result.isLeft()).toBe(true);
        expect((result.value as NotFound).message).toBe('Servico nao encontrado.');
    });
});
