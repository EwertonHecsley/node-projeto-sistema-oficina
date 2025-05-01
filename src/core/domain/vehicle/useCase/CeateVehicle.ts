import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { Either, left, right } from '../../../../shared/utils/either';
import { Vehicle } from '../entity/Vehicle';
import { VehicleRepositoy } from '../repository/VehicleRepository';

type Request = {
    plate: string;
};

type Response = Either<BadRequest, Vehicle>;

export class CreateVehicleUseCase {
    constructor(private readonly vehicleRepository: VehicleRepositoy) { }

    async execute(data: Request): Promise<Response> {
        const { plate } = data;

        if (!plate) {
            return left(new BadRequest('Placa inválida'));
        }

        const plateExists = await this.vehicleRepository.findByPlate(plate);
        if (plateExists) {
            return left(new BadRequest('Placa já cadastrada'));
        }

        const vehicle = Vehicle.create(plate);

        const createdVehicle = await this.vehicleRepository.create(vehicle);

        return right(createdVehicle);
    }
}
