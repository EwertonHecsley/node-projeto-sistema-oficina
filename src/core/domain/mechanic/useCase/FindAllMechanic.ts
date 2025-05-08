import { GenericErrors } from "../../../../shared/errors/GenericError";
import { Either, left, right } from "../../../../shared/utils/either";
import { Mechanic } from "../entity/Mechanic";
import { MechanicRepository } from "../repository/MechanicRepository";

type Response = Either<null | GenericErrors, Mechanic[]>;

export class FindAllMechanicsUseCase {
    constructor(private readonly mechanicRepository: MechanicRepository) { }

    async execute(): Promise<Response> {
        const mechanics = await this.mechanicRepository.findAll();

        if (!mechanics) return left(new GenericErrors('Erro interno no servidor', 500));

        return right(mechanics);
    };
}