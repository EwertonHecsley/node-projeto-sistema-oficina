import { ConsumerClient } from '../../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../../core/domain/consumerClient/objectValue/Email';
import { ClientRepositoy } from '../../../core/domain/consumerClient/repository/ClientRepository';
import { CreateConsumerClientUseCase } from '../../../core/domain/consumerClient/useCase/Create';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';

const makeMockRepository = (): jest.Mocked<ClientRepositoy> => ({
  getClientByEmail: jest.fn(),
  getClientByDocType: jest.fn(),
  createClient: jest.fn(),
  deleteClient: jest.fn(),
  getAllClients: jest.fn(),
  getClientById: jest.fn(),
  updateClient: jest.fn(),
  addaddVehicleToClient: jest.fn(),
});

const validRequest = {
  name: 'João Silva',
  documentType: '09253538414',
  email: 'joao@email.com',
  phone: '83999999999',
  city: 'Patos',
  juridicalPerson: false,
};

const validCNPJRequest = {
  name: 'Empresa X',
  documentType: '12345678000195',
  email: 'empresa@email.com',
  phone: '83999999999',
  city: 'Patos',
  juridicalPerson: true,
};

describe('CreateConsumerClientUseCase', () => {
  it('deve criar um cliente com sucesso', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    repo.getClientByEmail.mockResolvedValue(null);
    repo.getClientByDocType.mockResolvedValue(null);

    const createdClient = ConsumerClient.create({
      name: validRequest.name,
      city: validRequest.city,
      email: Email.create(validRequest.email),
      juridicalPerson: validRequest.juridicalPerson,
      docType: DocumentClient.create(validRequest.documentType, validRequest.juridicalPerson),
      phone: validRequest.phone,
    });

    repo.createClient.mockResolvedValue(createdClient);

    const result = await useCase.execute(validRequest);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(createdClient);
  });

  it('deve criar um cliente com CNPJ válido', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    repo.getClientByEmail.mockResolvedValue(null);
    repo.getClientByDocType.mockResolvedValue(null);

    const createdClient = ConsumerClient.create({
      name: validCNPJRequest.name,
      city: validCNPJRequest.city,
      email: Email.create(validCNPJRequest.email),
      juridicalPerson: validCNPJRequest.juridicalPerson,
      docType: DocumentClient.create(
        validCNPJRequest.documentType,
        validCNPJRequest.juridicalPerson,
      ),
      phone: validCNPJRequest.phone,
    });

    repo.createClient.mockResolvedValue(createdClient);

    const result = await useCase.execute(validCNPJRequest);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(createdClient);
  });

  it('deve retornar erro se o email já existir', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    repo.getClientByEmail.mockResolvedValue({} as ConsumerClient);

    const result = await useCase.execute(validRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
  });

  it('deve retornar erro se o documento já existir', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    repo.getClientByEmail.mockResolvedValue(null);
    repo.getClientByDocType.mockResolvedValue({} as ConsumerClient);

    const result = await useCase.execute(validRequest);

    expect(result.isLeft()).toBe(true);
  });

  it('deve retornar erro se o email for inválido', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    const invalidRequest = {
      ...validRequest,
      email: 'email_invalido',
    };

    repo.getClientByEmail.mockResolvedValue(null);
    repo.getClientByDocType.mockResolvedValue(null);

    const result = await useCase.execute(invalidRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
  });

  it('deve retornar erro se o documento for inválido', async () => {
    const repo = makeMockRepository();
    const useCase = new CreateConsumerClientUseCase(repo);

    const invalidRequest = {
      ...validRequest,
      documentType: 'abc',
    };

    repo.getClientByEmail.mockResolvedValue(null);
    repo.getClientByDocType.mockResolvedValue(null);

    const result = await useCase.execute(invalidRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
  });
});
