import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { Either, left, right } from '../../../../shared/utils/either';
import { Mechanic } from '../entity/Mechanic';
import { CPF } from '../objectValue/CPF';
import { Email } from '../objectValue/Email';
import { MechanicRepository } from '../repository/MechanicRepository';

type Request = {
  name: string;
  email: string;
  cpf: string;
  isAvaliable: boolean;
};

type Response = Either<BadRequest, Mechanic>;

export class CreateMechanicUseCase {
  constructor(private readonly mechanicRepository: MechanicRepository) {}

  async execute(props: Request): Promise<Response> {
    const { name, cpf, email } = props;

    const emailExist = await this.mechanicRepository.findByEmail(email);
    if (emailExist) return left(new BadRequest('Email ja cadastrado.'));

    const emailValidated = Email.create(email);

    const cpfExist = await this.mechanicRepository.findByCpf(cpf);
    if (cpfExist) return left(new BadRequest('CPF ja cadastrado.'));

    const cpfValidated = CPF.create(cpf);

    const mechanic = Mechanic.create({
      name,
      email: emailValidated,
      cpf: cpfValidated,
      isAvaliable: props.isAvaliable ?? true,
    });

    const newMechanic = await this.mechanicRepository.create(mechanic);

    return right(newMechanic);
  }
}
