import { BadRequest } from '../../../../shared/errors/custom/BadRequest';
import { Either, left, right } from '../../../../shared/utils/either';
import { ConsumerClient } from '../entity/ConsumerCLient';
import { DocumentClient } from '../objectValue/Document';
import { Email } from '../objectValue/Email';
import { ClientRepositoy } from '../repository/ClientRepository';

type Request = {
  name: string;
  documentType: string;
  email: string;
  phone: string;
  city: string;
  juridicalPerson: boolean;
};

type Response = Either<BadRequest, ConsumerClient>;

export class CreateConsumerClientUseCase {
  constructor(private readonly clientRepository: ClientRepositoy) {}

  async execute(props: Request): Promise<Response> {
    const { email, documentType, juridicalPerson, ...data } = props;

    const emailExist = await this.clientRepository.getClientByEmail(email);
    if (emailExist) return left(new BadRequest('Email já cadastrado para esse cliente.'));

    const documentTypeExist = await this.clientRepository.getClientByDocType(documentType);
    if (documentTypeExist)
      return left(new BadRequest('Documento já cadastrado para esse cliente.'));

    try {
      const emailValidated = Email.create(email);
      const documentValidated = DocumentClient.create(documentType, juridicalPerson);

      const newClient = ConsumerClient.create({
        ...data,
        email: emailValidated,
        docType: documentValidated,
        juridicalPerson,
      });

      const _client = await this.clientRepository.createClient(newClient);
      return right(_client);
    } catch (err) {
      if (err instanceof BadRequest) {
        return left(err);
      }
      throw err;
    }
  }
}
