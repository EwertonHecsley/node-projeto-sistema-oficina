import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { ClientRepositoy } from '../repository/ClientRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound, boolean>;

export class DeleteConsumerClientUseCase {
  constructor(private readonly clientRepository: ClientRepositoy) {}

  async execute({ id }: Request): Promise<Response> {
    const clientExist = await this.clientRepository.getClientById(id);

    if (!clientExist) return left(new NotFound('Cliente nao encontrado.'));

    await this.clientRepository.deleteClient(id);

    return right(true);
  }
}
