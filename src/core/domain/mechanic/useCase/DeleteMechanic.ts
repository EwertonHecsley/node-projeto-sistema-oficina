import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { MechanicRepository } from '../repository/MechanicRepository';

type Request = {
  id: string;
};

type Response = Either<BadRequest | NotFound, boolean>;

export class DeleteMechanicUseCase {
  constructor(private readonly mechanicRepository: MechanicRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const mechanicExist = await this.mechanicRepository.findById(id);

    if (!mechanicExist) return left(new NotFound('Mecanico nao encontrado.'));

    if (!mechanicExist.isAvaliable)
      return left(new BadRequest('Erro ao deletar mecanico em servico.'));

    await this.mechanicRepository.delete(id);

    return right(true);
  }
}
