import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateConsumerClientUseCase } from '../../../../core/domain/consumerClient/useCase/Create';
import { DeleteConsumerClientUseCase } from '../../../../core/domain/consumerClient/useCase/Delete';
import { FindConsumerClientUseCase } from '../../../../core/domain/consumerClient/useCase/FindClient';
import { ListAllConsumerClientUseCase } from '../../../../core/domain/consumerClient/useCase/ListAllClients';
import { UpdateConsumerClientUseCase } from '../../../../core/domain/consumerClient/useCase/UpdateClient';
import { ConsumerClietOrmRepository } from '../../../database/repository/consumerClient/ConsumeClientORMRepository';
import { CreateConsumerClientDto } from './dto/consumerClientSchemaDto';
import { logger } from '../../../../shared/utils/logger';
import { ConsumerClientPresenter } from '../presenter/consumerClient/ConsumerClientPresenter';

export class ConsumerClientController {
  private readonly createConsumerClientUseCase: CreateConsumerClientUseCase;
  private readonly findConsumerClientUseCase: FindConsumerClientUseCase;
  private readonly listAllConsumerClientUseCase: ListAllConsumerClientUseCase;
  private readonly deleteConsumerClientUseCase: DeleteConsumerClientUseCase;
  private readonly updateConsumerClientUseCase: UpdateConsumerClientUseCase;

  constructor(private readonly reposiory: ConsumerClietOrmRepository) {
    this.createConsumerClientUseCase = new CreateConsumerClientUseCase(this.reposiory);
    this.findConsumerClientUseCase = new FindConsumerClientUseCase(this.reposiory);
    this.listAllConsumerClientUseCase = new ListAllConsumerClientUseCase(this.reposiory);
    this.deleteConsumerClientUseCase = new DeleteConsumerClientUseCase(this.reposiory);
    this.updateConsumerClientUseCase = new UpdateConsumerClientUseCase(this.reposiory);
  }

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { ...data } = request.body as CreateConsumerClientDto;

    logger.info('Criando novo cliente...');
    const result = await this.createConsumerClientUseCase.execute({ ...data });

    if (result.isLeft()) {
      logger.error('Erro ao criar novo Cliente.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Cliente criado com sucesso.');
    reply.status(201).send({
      message: 'Cliente cadastrado com sucesso.',
      consumerClient: ConsumerClientPresenter.toHTTP(result.value),
    });
  }

  async list(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info('Listando clientes...');
    const result = await this.listAllConsumerClientUseCase.execute();

    if (result.isLeft()) {
      logger.error('Erro ao listar clientes.');
      reply.status(500).send({ message: 'Erro interno no servidor.' });
      return;
    }

    logger.info('Clientes listados com sucesso.');
    reply.status(200).send({
      message: 'Clientes listados com sucesso.',
      consumerClients: result.value.map(ConsumerClientPresenter.toHTTP),
    });
  }
}
