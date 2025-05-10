import { Mechanic } from "../../../../../core/domain/mechanic/entity/Mechanic";

export class MechanicPresenter {
    static toHTTP(entity: Mechanic) {
        return {
            id: entity.valueId.valueId,
            name: entity.name,
            isAvaliable: entity.isAvaliable
        }
    }
}