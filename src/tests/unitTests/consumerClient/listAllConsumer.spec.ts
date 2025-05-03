import { ConsumerClient } from '../../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../../core/domain/consumerClient/objectValue/Email';
import { ListAllConsumerClientUseCase } from '../../../core/domain/consumerClient/useCase/ListAllClients';
import Identity from '../../../core/generics/Identity';

describe('ListAllConsumerClientUseCase', () => {
  const mockRepository = {
    getAllClients: jest.fn(),
  } as any;

  const useCase = new ListAllConsumerClientUseCase(mockRepository);

  it('Deve listar todos os clientes cadastrados', async () => {
    const clientsMock: ConsumerClient[] = [
      ConsumerClient.create(
        {
          name: 'Ewerton',
          city: 'Patos',
          phone: '83988887777',
          juridicalPerson: false,
          docType: DocumentClient.create('09253538414', false),
          email: Email.create('ewerton@example.com'),
        },
        new Identity('client-id-1'),
      ),
      ConsumerClient.create(
        {
          name: 'Maria',
          city: 'João Pessoa',
          phone: '83999998888',
          juridicalPerson: true,
          docType: DocumentClient.create('02323033000106', true),
          email: Email.create('maria@example.com'),
        },
        new Identity('client-id-2'),
      ),
    ];

    mockRepository.getAllClients.mockResolvedValue(clientsMock);

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(clientsMock);
    expect(mockRepository.getAllClients).toHaveBeenCalledTimes(1);
  });
});
