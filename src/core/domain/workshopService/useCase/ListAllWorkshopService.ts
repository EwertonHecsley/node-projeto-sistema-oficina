import { Either, left, right } from '../../../../shared/utils/either';
import { WorkshopService } from '../entity/WorkshopService';
import { WorkshoServiceRepository } from '../repository/WorkshopServiceRepository';

type Response = Either<null, WorkshopService[]>;

export class ListAllWorkshopService {
  constructor(private readonly workshoServiceRepository: WorkshoServiceRepository) {}

  async execute(): Promise<Response> {
    const list = await this.workshoServiceRepository.listAll();

    if (!list) return left(null);

    return right(list);
  }
}
