import { FastifyReply, FastifyRequest } from "fastify";
import { CreateVehicleUseCase } from "../../../../core/domain/vehicle/useCase/CeateVehicle";
import { VehicleOrmRepository } from "../../../database/repository/vehicle/vehiceORMRepository";
import { CreateVehicleDto } from "./dto/vehicleSchemaDto";
import { VehiclePresenter } from "../presenter/vehicle/VehiclePresenter";

export class VehicleController {
    private readonly repository = new VehicleOrmRepository();
    private readonly createVehicle = new CreateVehicleUseCase(this.repository);

    async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { plate } = request.body as CreateVehicleDto;

        const result = await this.createVehicle.execute({ plate });

        if (result.isLeft()) {
            reply.status(result.value.statusCode).send({ message: result.value.message });
            return;
        }

        reply.status(201).send(
            {
                message: 'Veiculo criado com sucesso.',
                vehicle: VehiclePresenter.toHTTP(result.value)
            }
        )

    }
}
