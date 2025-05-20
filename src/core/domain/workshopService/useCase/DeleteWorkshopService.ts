import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { WorkshoServiceRepository } from '../repository/WorkshopServiceRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound | BadRequest, boolean>;

export class DeleteWorkshopServiceUseCase {
  constructor(private readonly workshopServiceRepository: WorkshoServiceRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const workshopService = await this.workshopServiceRepository.findById(id);

    if (!workshopService) return left(new NotFound('Servico nao encontrado.'));
    if (workshopService.status == 'ABERTO')
      return left(new BadRequest('Servico em aberto nao pode ser deletado.'));

    await this.workshopServiceRepository.delete(id);

    return right(true);
  }
}
