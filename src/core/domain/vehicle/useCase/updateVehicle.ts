import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { VehicleRepositoy } from '../repository/VehicleRepository';

type Request = {
  id: string;
  plate: string;
};

type Response = Either<NotFound | BadRequest, boolean>;

export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepositoy) {}

  async execute(data: Request): Promise<Response> {
    const { id, ...dataPlate } = data;

    const vehicleExist = await this.vehicleRepository.findById(id);

    if (!vehicleExist) return left(new NotFound('Veiculo nao encontrado.'));

    const plateExist = await this.vehicleRepository.findByPlate(dataPlate.plate);

    if (plateExist) return left(new BadRequest('Placa informada já cadastrada.'));

    vehicleExist.plate = dataPlate.plate;

    await this.vehicleRepository.update(vehicleExist);

    return right(true);
  }
}
