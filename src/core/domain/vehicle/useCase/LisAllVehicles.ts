import { Either, left, right } from "../../../../shared/utils/either";
import { Vehicle } from "../entity/Vehicle";
import { VehicleRepositoy } from "../repository/VehicleRepository";

type Response = Either<null, Vehicle[]>;

export class ListAllVehiclesUseCase {
    constructor(private readonly vehicleRepository: VehicleRepositoy) { }

    async execute(): Promise<Response> {
        const vehicles = await this.vehicleRepository.findAll();

        if (!vehicles) return left(null);

        return right(vehicles);
    }
}