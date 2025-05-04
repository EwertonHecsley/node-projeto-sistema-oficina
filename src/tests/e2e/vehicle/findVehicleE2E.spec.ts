import { buildApp } from "../buildApp";
import { InMemoryVeiculoRepository } from "../fakeRepository/InMemoryVeiculoRepository";


describe('E2E - Buscar Veículo por ID', () => {
    let app: Awaited<ReturnType<typeof buildApp>>;

    beforeEach(async () => {
        app = await buildApp({
            vehicleRepository: new InMemoryVeiculoRepository()
        });
    });

    it('Deve retornar um veículo com sucesso ao buscar pelo ID', async () => {
        const createResponse = await app.inject({
            method: 'POST',
            url: '/vehicle',
            payload: {
                plate: 'BUS-0001'
            }
        });

        const createBody = JSON.parse(createResponse.body);
        const vehicleId = createBody.vehicle.id;

        const response = await app.inject({
            method: 'GET',
            url: `/vehicle/${vehicleId}`
        });

        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual(
            expect.objectContaining({
                message: 'Veiculo encontrado com sucesso.',
                vehicle: expect.objectContaining({
                    id: vehicleId,
                    plate: 'BUS-0001'
                })
            })
        );
    });

    it('Deve retornar erro 400 ao buscar veículo com ID formato invalido', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/vehicle/nao-existe-id'
        });

        expect(response.statusCode).toBe(400);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual({
            message: 'Parâmetros inválidos.'
        });
    });

    it('Deve retornar erro 404 ao buscar veiculo com ID que nao existe', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/vehicle/3772e5ab-f8d5-4685-804f-f9551770eedc'
        });

        expect(response.statusCode).toBe(404);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual({
            message: 'Veículo não encontrado'
        });
    })
});
