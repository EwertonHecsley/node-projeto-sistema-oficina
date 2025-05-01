import { ConsumerClient } from '../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../core/domain/consumerClient/objectValue/Email';
import { ClientRepositoy } from '../../core/domain/consumerClient/repository/ClientRepository';
import { UpdateConsumerClientUseCase } from '../../core/domain/consumerClient/useCase/UpdateClient';
import { BadRequest } from '../../shared/errors/custom/BadRequest';
import { NotFound } from '../../shared/errors/custom/NotFound';
import { left } from '../../shared/utils/either';

const mockRepo = {
  getClientById: jest.fn(),
  getClientByEmail: jest.fn(),
  getClientByDocType: jest.fn(),
  updateClient: jest.fn(),
} as unknown as jest.Mocked<ClientRepositoy>;

const useCase = new UpdateConsumerClientUseCase(mockRepo);

const fakeClient = ConsumerClient.create({
  name: 'João',
  city: 'Patos',
  email: Email.create('email@teste.com'),
  docType: DocumentClient.create('09253538414', false),
  juridicalPerson: false,
  phone: '83988887777',
});

describe('UpdateConsumerClientUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve atualizar com sucesso', async () => {
    mockRepo.getClientById.mockResolvedValue(fakeClient);
    mockRepo.getClientByEmail.mockResolvedValue(null);
    mockRepo.getClientByDocType.mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'client-123',
      email: 'novo@email.com',
    });

    expect(result.isRight()).toBe(true);
    expect(mockRepo.updateClient).toHaveBeenCalled();
  });

  it('deve retornar erro se o ID não for informado', async () => {
    const result = await useCase.execute({} as any);
    expect(result).toEqual(left(new BadRequest('ID e obrigatrorio.')));
  });

  it('deve retornar erro se cliente não existir', async () => {
    mockRepo.getClientById.mockResolvedValue(null);
    const result = await useCase.execute({ id: 'client-123' });
    expect(result).toEqual(left(new NotFound('Cliene nao encontrado.')));
  });

  it('deve retornar erro se email já estiver em uso', async () => {
    mockRepo.getClientById.mockResolvedValue(fakeClient);
    mockRepo.getClientByEmail.mockResolvedValue(fakeClient);
    const result = await useCase.execute({ id: 'client-123', email: 'duplicado@email.com' });
    expect(result).toEqual(left(new BadRequest('Email ja cadastrado.')));
  });

  it('deve retornar erro se docType já estiver em uso', async () => {
    mockRepo.getClientById.mockResolvedValue(fakeClient);
    mockRepo.getClientByEmail.mockResolvedValue(null);
    mockRepo.getClientByDocType.mockResolvedValue(fakeClient);
    const result = await useCase.execute({
      id: 'client-123',
      docType: '999999',
      juridicalPerson: true,
    });
    expect(result).toEqual(left(new BadRequest('DocType ja cadastrado.')));
  });
});
