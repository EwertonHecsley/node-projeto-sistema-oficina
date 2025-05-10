import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateMechanicUseCase } from '../../../../core/domain/mechanic/useCase/CreateMechanic';
import { DeleteMechanicUseCase } from '../../../../core/domain/mechanic/useCase/DeleteMechanic';
import { FindAllMechanicsUseCase } from '../../../../core/domain/mechanic/useCase/FindAllMechanic';
import { FindMechanicUseCase } from '../../../../core/domain/mechanic/useCase/FindMechanic';
import { UpdateMechanicUseCase } from '../../../../core/domain/mechanic/useCase/UpdateMechanic';
import { MechanicOrmRepository } from '../../../database/repository/mechanic/MechanicORMRepository';
import { CreateMechanicDto } from './dto/mechanicSchemaDto';
import { logger } from '../../../../shared/utils/logger';
import { MechanicPresenter } from '../presenter/mechanic/MechanicPresenter';
import { mechanicParamsSchema } from './dto/mechanicSchemaParamsDto';
import { UpdateCreateMechanicDto } from './dto/mechanicUpdateSchemaDto';

export class MechanicController {
  private readonly createMechanic: CreateMechanicUseCase;
  private readonly findMechanic: FindMechanicUseCase;
  private readonly findAllMechanic: FindAllMechanicsUseCase;
  private readonly deleteMechanic: DeleteMechanicUseCase;
  private readonly updateMechanic: UpdateMechanicUseCase;

  constructor(private readonly mechanicRepository: MechanicOrmRepository) {
    this.createMechanic = new CreateMechanicUseCase(this.mechanicRepository);
    this.findMechanic = new FindMechanicUseCase(this.mechanicRepository);
    this.findAllMechanic = new FindAllMechanicsUseCase(this.mechanicRepository);
    this.deleteMechanic = new DeleteMechanicUseCase(this.mechanicRepository);
    this.updateMechanic = new UpdateMechanicUseCase(this.mechanicRepository);
  }

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { ...data } = request.body as CreateMechanicDto;

    logger.info('Criando novo mecanico...');
    const result = await this.createMechanic.execute({ ...data });

    if (result.isLeft()) {
      logger.error('Error ao criar novo mecanico.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Mecanico criado com sucesso.');
    reply.status(201).send({
      message: 'Mecanico criado com sucesso',
      mechanic: MechanicPresenter.toHTTP(result.value),
    });
  }

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const paramsValidate = mechanicParamsSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!paramsValidate.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = paramsValidate.data;

    logger.info('Buscando mecanico...');
    const result = await this.findMechanic.execute({ id });

    if (result.isLeft()) {
      logger.error('Erro ao buscar mecanico.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Mecanico encontrado com sucesso.');
    reply.status(200).send({
      message: 'Mecanico encontrado com sucesso.',
      mechanic: MechanicPresenter.toHTTP(result.value),
    });
  }

  async list(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info('Listando mecanicos...');
    const result = await this.findAllMechanic.execute();

    if (!result) {
      logger.error('Erro interno no servidor.');
      reply.status(500).send({ message: 'Erro interno no servidor' });
      return;
    }

    if (result.isLeft()) {
      logger.error('Erro ao listar mecanicos.');
      reply.status(500).send({ message: 'Erro interno ao listar todos os mecanicos.' });
      return;
    }

    logger.info('Listado mecanicos com sucesso.');
    reply.status(200).send({
      message: 'Listado mecanicos com sucesso.',
      mechanic: result.value.map(MechanicPresenter.toHTTP),
    });
  }

  async destroy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const paramsValidate = mechanicParamsSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!paramsValidate.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = paramsValidate.data;

    logger.info('Deletando mecanico...');
    const result = await this.deleteMechanic.execute({ id });

    if (result.isLeft()) {
      logger.error('Error ao deletar mecanico.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Deletado mecanico com sucesso.');
    reply.status(204).send();
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const paramsValidate = mechanicParamsSchema.safeParse(request.params);
    const { ...data } = request.body as UpdateCreateMechanicDto;

    logger.error('Dados invalidos na requisicao.');
    if (!paramsValidate.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = paramsValidate.data;

    logger.info('Atualizando mecanico...');
    const result = await this.updateMechanic.execute({ id, ...data });

    if (result.isLeft()) {
      logger.error('Erro ao atualizar mocanico.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Mecanico atualizado com sucesso.');
    reply.status(204).send();
  }
}
