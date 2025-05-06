import { buildApp } from '../buildApp';
import { InMemoryConsumerClientRepository } from '../fakeRepository/InMemoryConsumerClientRepositoy';
import { InMemoryVeiculoRepository } from '../fakeRepository/InMemoryVeiculoRepository';

describe('E2E - Atualizar Veículo', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    app = await buildApp({
      vehicleRepository: new InMemoryVeiculoRepository(),
      consumerClientRepository: new InMemoryConsumerClientRepository(),
    });
  });

  it('Deve atualizar a placa do veículo com sucesso', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: { plate: 'ABC-1234' },
    });

    const { vehicle } = JSON.parse(createResponse.body);

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/vehicle/${vehicle.id}`,
      payload: { plate: 'XYZ-5678' },
    });

    expect(updateResponse.statusCode).toBe(204);
  });

  it('Deve retornar erro 400 ao passar ID com formato inválido', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/vehicle/id-invalido',
      payload: { plate: 'NEW-0001' },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);

    expect(body).toEqual({
      message: 'Parâmetros inválidos.',
    });
  });

  it('Deve retornar erro 404 ao tentar atualizar veículo com ID que não existe', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/vehicle/3772e5ab-f8d5-4685-804f-f9551770eedc',
      payload: { plate: 'NEW-0002' },
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);

    expect(body).toEqual({
      message: 'Veiculo nao encontrado.',
    });
  });

  it('Deve retornar erro 400 ao tentar atualizar veículo para placa já existente', async () => {
    const vehicle1 = await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: { plate: 'REP-1001' },
    });
    const vehicle2 = await app.inject({
      method: 'POST',
      url: '/vehicle',
      payload: { plate: 'REP-1002' },
    });

    const { vehicle } = JSON.parse(vehicle2.body);

    const response = await app.inject({
      method: 'PUT',
      url: `/vehicle/${vehicle.id}`,
      payload: { plate: 'REP-1001' },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);

    expect(body).toEqual({
      message: 'Placa informada já cadastrada.',
    });
  });
});
