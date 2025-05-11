import { NotFound } from "../../../../shared/errors/custom/NotFound";
import { Either, left, right } from "../../../../shared/utils/either";
import { WorkshopService } from "../entity/WorkshopService";
import { WorkshoServiceRepository } from "../repository/WorkshopServiceRepository";

type Request = {
    id: string;
}

type Response = Either<NotFound, WorkshopService>;

export class FindWorkshopServiceUseCase {
    constructor(private readonly workshopService: WorkshoServiceRepository) { }

    async execute({ id }: Request): Promise<Response> {
        const service = await this.workshopService.findById(id);
        if (!service) return left(new NotFound('Servico nao encontrado.'));

        return right(service);
    }
}