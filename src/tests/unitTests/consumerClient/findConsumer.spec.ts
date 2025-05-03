import { ConsumerClient } from '../../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../../core/domain/consumerClient/objectValue/Email';
import { FindConsumerClientUseCase } from '../../../core/domain/consumerClient/useCase/FindClient';
import Identity from '../../../core/generics/Identity';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockRepository = {
  getClientById: jest.fn(),
} as any;

const useCase = new FindConsumerClientUseCase(mockRepository);

describe('FindConsumerClientUseCase', () => {
  const clientId = 'any-id';
  const clientMock = ConsumerClient.create(
    {
      name: 'Ewerton',
      city: 'Patos',
      phone: '83988887777',
      juridicalPerson: false,
      docType: DocumentClient.create('09253538414', false),
      email: Email.create('ewerton@example.com'),
    },
    new Identity(clientId),
  );

  it('Deve retornar um cliente com o Id passado', async () => {
    mockRepository.getClientById.mockResolvedValue(clientMock);

    const result = await useCase.execute({ id: clientId });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(clientMock);
  });

  it('Deve retornar um erro NOT FOUND caso o cliente nao exista', async () => {
    mockRepository.getClientById.mockResolvedValue(null);

    const result = await useCase.execute({ id: clientId });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Cliente nao encontrado.');
  });
});
