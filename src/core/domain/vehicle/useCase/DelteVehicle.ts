import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { VehicleRepositoy } from '../repository/VehicleRepository';

type Request = {
  id: string;
};

type Response = Either<NotFound, boolean>;

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepositoy) {}

  async execute({ id }: Request): Promise<Response> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) return left(new NotFound('Veiculo nao encontrado.'));

    await this.vehicleRepository.delete(id);

    return right(true);
  }
}
