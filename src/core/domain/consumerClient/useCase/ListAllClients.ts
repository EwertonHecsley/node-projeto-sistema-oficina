import { Either, left, right } from '../../../../shared/utils/either';
import { ConsumerClient } from '../entity/ConsumerCLient';
import { ClientRepositoy } from '../repository/ClientRepository';

type Response = Either<null, ConsumerClient[]>;

export class ListAllConsumerClientUseCase {
  constructor(private readonly clientRepository: ClientRepositoy) {}

  async execute(): Promise<Response> {
    const list = await this.clientRepository.getAllClients();

    if (!list) return left(null);

    return right(list);
  }
}
