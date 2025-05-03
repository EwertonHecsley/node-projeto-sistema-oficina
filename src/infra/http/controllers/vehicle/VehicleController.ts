import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateVehicleUseCase } from '../../../../core/domain/vehicle/useCase/CeateVehicle';
import { VehicleOrmRepository } from '../../../database/repository/vehicle/vehiceORMRepository';
import { CreateVehicleDto } from './dto/vehicleSchemaDto';
import { VehiclePresenter } from '../presenter/vehicle/VehiclePresenter';
import { ListAllVehiclesUseCase } from '../../../../core/domain/vehicle/useCase/LisAllVehicles';
import { FindVehicleUseCase } from '../../../../core/domain/vehicle/useCase/findVehicle';
import { DeleteVehicleUseCase } from '../../../../core/domain/vehicle/useCase/DelteVehicle';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { UpdateVehicleDto } from './dto/vehicleUpdateSchemaDto';
import { UpdateVehicleUseCase } from '../../../../core/domain/vehicle/useCase/updateVehicle';
import { logger } from '../../../../shared/utils/logger';
import { vehicleIdParamSchema } from './dto/vehicleParamsSchemaDto';

export class VehicleController {
  private readonly repository = new VehicleOrmRepository();
  private readonly createVehicle = new CreateVehicleUseCase(this.repository);
  private readonly listAllVehicleUseCase = new ListAllVehiclesUseCase(this.repository);
  private readonly findVehicleUseCase = new FindVehicleUseCase(this.repository);
  private readonly deleteVehicleUseCase = new DeleteVehicleUseCase(this.repository);
  private readonly updateVehicleUseCase = new UpdateVehicleUseCase(this.repository);

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { plate } = request.body as CreateVehicleDto;

    logger.info('Criando novo veiculo...');
    const result = await this.createVehicle.execute({ plate });

    if (result.isLeft()) {
      logger.error('Erro ao criar veiculo.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Veiculo criado com sucesso.');
    reply.status(201).send({
      message: 'Veiculo criado com sucesso.',
      vehicle: VehiclePresenter.toHTTP(result.value),
    });
  }

  async list(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info('Listando veiculos...');
    const result = await this.listAllVehicleUseCase.execute();

    if (result.isLeft()) {
      logger.error('Erro ao criar veiculo.');
      reply.status(500).send({ message: 'Erro interno do servidor.' });
      return;
    }

    reply.status(200).send({
      message: 'Lista de veciulos.',
      vehicle: result.value.map((element) => VehiclePresenter.toHTTP(element)),
    });
  }

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = vehicleIdParamSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Buscando veiculo');
    const result = await this.findVehicleUseCase.execute({ id });

    if (result.isLeft()) {
      logger.error('Erro ao buscar veiculo.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Veiculo encontrado com sucesso.');
    reply.status(200).send({
      message: 'Veiculo encontrado com sucesso.',
      vehicle: VehiclePresenter.toHTTP(result.value),
    });
  }

  async destroy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = vehicleIdParamSchema.safeParse(request.params);

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Deletando veiculo...');
    const result = await this.deleteVehicleUseCase.execute({ id });

    if (result.isLeft()) {
      logger.error('Erro ao deletar veiculo.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Veiculo deletado com sucesso.');
    reply.status(204).send();
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parseResult = vehicleIdParamSchema.safeParse(request.params);
    const { plate } = request.body as UpdateVehicleDto;

    logger.error('Dados invalidos na requisicao.');
    if (!parseResult.success) {
      reply.status(400).send({ message: 'Parâmetros inválidos.' });
      return;
    }

    const { id } = parseResult.data;

    logger.info('Atualizando veiculo...');
    const result = await this.updateVehicleUseCase.execute({ id, plate });

    if (result.isLeft()) {
      logger.error('Erro ao atualizar veiculo.');
      reply.status(result.value.statusCode).send({ message: result.value.message });
      return;
    }

    logger.info('Veiculo atualizado com sucesso.');
    reply.status(204).send();
  }
}
