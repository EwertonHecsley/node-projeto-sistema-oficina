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
import { consumerClientParamsSchema } from './dto/consumerClientParamsSchemaDto';
import { UpdateConsumerClientDto } from './dto/consumerClientUpdateSchemaDto';
import { AddVehicleToClientDto } from './dto/addVehicleToClientSchemaDto';
import { AddVehicleToClientUseCase } from '../../../../core/domain/consumerClient/useCase/AddVehicleToClientUseCase';
import { VehicleOrmRepository } from '../../../database/repository/vehicle/vehiceORMRepository';

export class ConsumerClientController {
  private readonly createConsumerClientUseCase: CreateConsumerClientUseCase;
  private readonly findConsumerClientUseCase: FindConsumerClientUseCase;
  private readonly listAllConsumerClientUseCase: ListAllConsumerClientUseCase;
  private readonly deleteConsumerClientUseCase: DeleteConsumerClientUseCase;
  private readonly updateConsumerClientUseCase: UpdateConsumerClientUseCase;
  private readonly addVehicleToClientUseCase: AddVehicleToClientUseCase;

  constructor(
    private readonly reposiory: ConsumerClietOrmRepository,
    private readonly repositoryVehicle: VehicleOrmRepository,
  ) {
    this.createConsumerClientUseCase = new CreateConsumerClientUseCase(this.reposiory);
    this.findConsumerClientUseCase = new FindConsumerClientUseCase(this.reposiory);
    this.listAllConsumerClientUseCase = new ListAllConsumerClientUseCase(this.reposiory);
    this.deleteConsumerClientUseCase = new DeleteConsumerClientUseCase(this.reposiory);
    this.updateConsumerClientUseCase = new UpdateConsumerClientUseCase(this.reposiory);
    this.addVehicleToClientUseCase = new AddVehicleToClientUseCase(
      this.reposiory,
      this.repositoryVehicle,
    );
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

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = consumerClientParamsSchema.safeParse(request.params);
    const { ...data } = request.body as UpdateConsumerClientDto;

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Atualizando cliente...');
    const result = await this.updateConsumerClientUseCase.execute({ id, ...data });

    if (result.isLeft()) {
      logger.error('Erro ao atualizar cliente.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    reply.status(204).send();
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

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = consumerClientParamsSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Buscando Cliente...');
    const result = await this.findConsumerClientUseCase.execute({ id });

    if (result.isLeft()) {
      logger.error('Erro ao buscar cliente.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Cliente encontrado com sucesso.');
    reply.status(200).send({
      message: 'Cliente encontrado com sucesso.',
      consumerClient: ConsumerClientPresenter.toHTTP(result.value),
    });
  }

  async destroy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = consumerClientParamsSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Deletando cliente...');
    const result = await this.deleteConsumerClientUseCase.execute({ id });

    if (result.isLeft()) {
      logger.error('Erro ao deletar cliente.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Cliente deletado com sucesso.');
    reply.status(204).send();
  }

  async addVehicle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = AddVehicleToClientDto.safeParse(request.body);

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { clientId, plate } = parseResult.data;

    logger.info('Adicionando veiculo ao cliente...');

    const result = await this.addVehicleToClientUseCase.execute({ clientId, plate });

    if (result.isLeft()) {
      logger.error('Erro ao adicionar veiculo ao cliente.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Veiculo adicionado ao cliente com sucesso.');
    reply.status(201);
  }
}
