import { NotFound } from "../../../../shared/errors/custom/NotFound";
import { Either, left, right } from "../../../../shared/utils/either";
import { MechanicRepository } from "../../mechanic/repository/MechanicRepository";
import { VehicleRepositoy } from "../../vehicle/repository/VehicleRepository";
import { WorkshopService } from "../entity/WorkshopService";
import { StatusServico } from "../enum/status";
import { WorkshoServiceRepository } from "../repository/WorkshopServiceRepository";

type Request = {
    description: string;
    cost: number;
    estimatedTimeMinutes: number;
    mechanicId: string;
    vehicleId: string;
}

type Response = Either<NotFound, WorkshopService>;

export class CreateWorkshopServiceUseCase {
    constructor(
        private readonly workshopServiceRepository: WorkshoServiceRepository,
        private readonly mechanicRepository: MechanicRepository,
        private readonly vehicleRepository: VehicleRepositoy
    ) { }

    async execute(data: Request): Promise<Response> {
        const { mechanicId, vehicleId } = data;

        const mechanicExist = await this.mechanicRepository.findById(mechanicId);
        if (!mechanicExist) return left(new NotFound('Mecanico nao encontrado para esse servico.'));

        const vehicleExist = await this.vehicleRepository.findById(vehicleId);
        if (!vehicleExist) return left(new NotFound('Veiculo nao encontrado para esse servico.'));

        const createService = WorkshopService.create({
            description: data.description,
            cost: data.cost,
            estimatedTimeMinutes: data.estimatedTimeMinutes,
            vehicleId,
            mechanicId,
            openDate: new Date(),
            closeDate: null,
            status: StatusServico.ABERTO
        });

        const createdService = await this.workshopServiceRepository.create(createService);

        return right(createdService);
    }
}