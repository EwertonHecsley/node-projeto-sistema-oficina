import { Vehicle } from "../../../../../core/domain/vehicle/entity/Vehicle";

export class VehiclePresenter {
    static toHTTP(entity: Vehicle) {
        return {
            id: entity.valueId,
            plate: entity.plate
        }
    }
}