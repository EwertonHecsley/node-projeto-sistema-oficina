import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { ConsumerClient } from '../entity/ConsumerCLient';
import { ClientRepositoy } from '../repository/ClientRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound, ConsumerClient>;

export class FindConsumerClientUseCase {
  constructor(private readonly clientRepository: ClientRepositoy) {}

  async execute({ id }: Request): Promise<Response> {
    const findClient = await this.clientRepository.getClientById(id);

    if (!findClient) return left(new NotFound('Cliente nao encontrado.'));

    return right(findClient);
  }
}
