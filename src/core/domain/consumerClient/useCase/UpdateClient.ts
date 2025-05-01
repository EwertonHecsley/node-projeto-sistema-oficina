import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../../shared/errors/custom/NotFound';
import { Either, left, right } from '../../../../shared/utils/either';
import { DocumentClient } from '../objectValue/Document';
import { Email } from '../objectValue/Email';
import { ClientRepositoy } from '../repository/ClientRepository';

type Request = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  docType?: string;
  city?: string;
  juridicalPerson?: boolean;
};

type Response = Either<NotFound | BadRequest, boolean>;

export class UpdateConsumerClientUseCase {
  constructor(private readonly clientRepository: ClientRepositoy) {}

  async execute(data: Request): Promise<Response> {
    const { id, ...rest } = data;

    if (!id) {
      return left(new BadRequest('ID e obrigatrorio.'));
    }

    const clientExists = await this.clientRepository.getClientById(id);

    if (!clientExists) {
      return left(new NotFound('Cliene nao encontrado.'));
    }

    if (rest.email) {
      const emailExist = await this.clientRepository.getClientByEmail(rest.email);
      if (emailExist) return left(new BadRequest('Email ja cadastrado.'));

      const newEmail = Email.create(rest.email);

      clientExists.email = newEmail;
    }

    if (rest.docType && rest.juridicalPerson) {
      const docTypeExist = await this.clientRepository.getClientByDocType(rest.docType);
      if (docTypeExist) return left(new BadRequest('DocType ja cadastrado.'));

      const newDocType = DocumentClient.create(rest.docType, rest.juridicalPerson);
      clientExists.docType = newDocType;
    }

    if (rest.name) clientExists.name = rest.name;
    if (rest.phone) clientExists.phone = rest.phone;
    if (rest.city) clientExists.city = rest.city;

    await this.clientRepository.updateClient(id, clientExists);

    return right(true);
  }
}
