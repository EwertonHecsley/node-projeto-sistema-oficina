import Entity from '../../../generics/Entity';
import Identity from '../../../generics/Identity';

type VehicleType = {
    plate: string;
};

export class Vehicle extends Entity<VehicleType> {
    private constructor(plate: VehicleType, id?: Identity) {
        super(plate, id);
    }

    static create(plate: VehicleType, id?: Identity): Vehicle {
        return new Vehicle(
            {
                ...plate
            },
            id
        );
    }

    get plate(): string {
        return this.properties.plate;
    }

    set plate(plate: string) {
        this.properties.plate = plate;
    }
}
