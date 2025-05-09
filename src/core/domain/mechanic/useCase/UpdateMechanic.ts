import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { CPF } from '../objectValue/CPF';
import { Email } from '../objectValue/Email';
import { MechanicRepository } from '../repository/MechanicRepository';

type Request = {
  id: string;
  name?: string;
  email?: string;
  cpf?: string;
  isAvaliable?: boolean;
};

type Response = Either<NotFound | BadRequest, boolean>;

export class UpdateMechanicUseCase {
  constructor(private readonly mechanicRepository: MechanicRepository) {}

  async execute(data: Request): Promise<Response> {
    if (!data.id) return left(new BadRequest('ID é obrigatorio.'));

    const mechanicExist = await this.mechanicRepository.findById(data.id);

    if (!mechanicExist) return left(new NotFound('Mecanico nao encontrado.'));

    if (data.email !== undefined) {
      if (data.email !== mechanicExist.email.valueEmail) {
        const emailExist = await this.mechanicRepository.findByEmail(data.email);
        if (emailExist && emailExist.valueId.valueId !== mechanicExist.valueId.valueId) {
          return left(new BadRequest('Email ja cadastrado para outro mecanico.'));
        }
      }

      try {
        const emailValidated = Email.create(data.email);
        mechanicExist.setEmail(emailValidated);
      } catch (error: any) {
        return left(new BadRequest(`Email invalido: ${error.message}`));
      }
    }

    if (data.cpf !== undefined) {
      if (data.cpf !== mechanicExist.cpf.valueCpf) {
        const cpfExist = await this.mechanicRepository.findByCpf(data.cpf);
        if (cpfExist && cpfExist.valueId.valueId !== mechanicExist.valueId.valueId) {
          return left(new BadRequest(`CPF ja cadastrado para outro mecanico.`));
        }
      }

      try {
        const cpfValidated = CPF.create(data.cpf);
        mechanicExist.setCPF(cpfValidated);
      } catch (error: any) {
        return left(new BadRequest(`CPF invalido.`));
      }
    }

    if (data.name !== undefined) {
      mechanicExist.setName(data.name);
    }

    if (data.isAvaliable !== undefined) {
      mechanicExist.setIsAvaliable(data.isAvaliable);
    }

    await this.mechanicRepository.update(mechanicExist);

    return right(true);
  }
}
