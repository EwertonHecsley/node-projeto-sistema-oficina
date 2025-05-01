import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { Vehicle } from '../entity/Vehicle';
import { VehicleRepositoy } from '../repository/VehicleRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound, Vehicle>;

export class FindVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepositoy) {}

  async execute(data: Request): Promise<Response> {
    const { id } = data;

    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      return left(new NotFound('Veículo não encontrado'));
    }

    return right(vehicle);
  }
}
