import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { Vehicle } from '../../vehicle/entity/Vehicle';
import { VehicleRepositoy } from '../../vehicle/repository/VehicleRepository';
import { ClientRepositoy } from '../repository/ClientRepository';

type Request = {
  clientId: string;
  plate: string;
};

type Response = Either<NotFound | BadRequest, boolean>;

export class AddVehicleToClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepositoy,
    private readonly vehicleRepository: VehicleRepositoy,
  ) {}

  async execute({ clientId, plate }: Request): Promise<Response> {
    const clientExist = await this.clientRepository.getClientById(clientId);

    if (!clientExist) return left(new NotFound('Cliente nao encontrado.'));

    const plateExist = await this.vehicleRepository.findByPlate(plate);

    if (!plateExist) return left(new NotFound('Placa nao encontrada.'));

    const vehicle = Vehicle.create({ plate });
    await this.vehicleRepository.addVehicleToClient(vehicle, clientId);
    clientExist.addVehicle(vehicle);

    return right(true);
  }
}
