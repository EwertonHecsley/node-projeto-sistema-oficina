import { ConsumerClient } from '../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../core/domain/consumerClient/objectValue/Email';
import { DeleteConsumerClientUseCase } from '../../core/domain/consumerClient/useCase/Delete';
import Identity from '../../core/generics/Identity';
import { NotFound } from '../../shared/errors/custom/NotFound';

describe('DeleteConsumerClientUseCase', () => {
  const mockRepository = {
    getClientById: jest.fn(),
    deleteClient: jest.fn(),
  } as any;

  const useCase = new DeleteConsumerClientUseCase(mockRepository);

  const existingClient = ConsumerClient.create(
    {
      name: 'Cliente Teste',
      city: 'Cidade',
      phone: '11999999999',
      juridicalPerson: false,
      docType: DocumentClient.create('09253538414', false),
      email: Email.create('teste@email.com'),
    },
    new Identity('valid-client-id'),
  );

  it('Deve deletar um cliente ao passar o ID', async () => {
    mockRepository.getClientById.mockResolvedValue(existingClient);
    mockRepository.deleteClient.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 'valid-client-id' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    expect(mockRepository.getClientById).toHaveBeenCalledWith('valid-client-id');
    expect(mockRepository.deleteClient).toHaveBeenCalledWith('valid-client-id');
  });

  it('Deve retornar um erro NotFound ao passar um id invalido', async () => {
    mockRepository.getClientById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'invalid-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Cliente nao encontrado.');
  });
});
