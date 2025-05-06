import { buildApp } from '../buildApp';
import { InMemoryConsumerClientRepository } from '../fakeRepository/InMemoryConsumerClientRepositoy';
import { InMemoryVeiculoRepository } from '../fakeRepository/InMemoryVeiculoRepository';

describe('E2E - Criar Veiculo', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    app = await buildApp({
      vehicleRepository: new InMemoryVeiculoRepository(),
      consumerClientRepository: new InMemoryConsumerClientRepository(),
    });
  });

  it('Deve criar um veículo com sucesso.', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: {
        plate: 'DEZ-0912',
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it('Não deve permitir criar um veículo com placa já existente.', async () => {
    await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: {
        plate: 'ABC-1234',
      },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: {
        plate: 'ABC-1234',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });
});
