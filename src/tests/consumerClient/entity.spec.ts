import { ConsumerClient } from '../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../core/domain/consumerClient/objectValue/Email';
import Identity from '../../core/generics/Identity';
import { BadRequest } from '../../shared/errors/custom/BadRequest';

describe('ConsumerClient', () => {
  const validProps = {
    name: 'João Silva',
    docType: DocumentClient.create('09253538414', false),
    email: Email.create('joao@email.com'),
    phone: '83999999999',
    city: 'Patos',
    juridicalPerson: false,
  };

  it('deve criar um cliente corretamente com os dados fornecidos', () => {
    const client = ConsumerClient.create(validProps);

    expect(client.name).toBe(validProps.name);
    expect(client.docType).toBe(validProps.docType);
    expect(client.email).toBe(validProps.email);
    expect(client.phone).toBe(validProps.phone);
    expect(client.city).toBe(validProps.city);
    expect(client.juridicalPerson).toBe(validProps.juridicalPerson);
  });

  it('deve permitir atualizar as propriedades via setters', () => {
    const client = ConsumerClient.create(validProps);

    // Testando setters
    client.name = 'Carlos Souza';
    client.phone = '83988888888';
    client.city = 'Campina Grande';
    client.juridicalPerson = true;

    expect(client.name).toBe('Carlos Souza');
    expect(client.phone).toBe('83988888888');
    expect(client.city).toBe('Campina Grande');
    expect(client.juridicalPerson).toBe(true);
  });

  it('deve retornar a propriedade correta ao acessar os getters', () => {
    const client = ConsumerClient.create(validProps);

    // Testando getters
    expect(client.name).toBe(validProps.name);
    expect(client.docType).toBe(validProps.docType);
    expect(client.email).toBe(validProps.email);
    expect(client.phone).toBe(validProps.phone);
    expect(client.city).toBe(validProps.city);
    expect(client.juridicalPerson).toBe(validProps.juridicalPerson);
  });

  it('deve permitir passar um ID opcional durante a criação', () => {
    const identity = new Identity('unique-id');
    const client = ConsumerClient.create(validProps, identity);

    expect(client.valueId.valueId).toBe(identity.valueId);
  });
});
