import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { Mechanic } from '../entity/Mechanic';
import { MechanicRepository } from '../repository/MechanicRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound, Mechanic>;

export class FindMechanicUseCase {
  constructor(private readonly mechanicRepository: MechanicRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const mechanic = await this.mechanicRepository.findById(id);

    if (!mechanic) return left(new NotFound('Mecanico nao encontrado.'));

    return right(mechanic);
  }
}
