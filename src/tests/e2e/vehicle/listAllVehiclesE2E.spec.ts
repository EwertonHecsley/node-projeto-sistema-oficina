import { buildApp } from "../buildApp";
import { InMemoryVeiculoRepository } from "../fakeRepository/InMemoryVeiculoRepository";

describe('E2E - Listar Veículos', () => {
    let app: Awaited<ReturnType<typeof buildApp>>;

    beforeEach(async () => {
        app = await buildApp({
            vehicleRepository: new InMemoryVeiculoRepository()
        });
    });

    it('Deve retornar um array vazio quando não houver veículos.', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/vehicle'
        });

        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                vehicle: []
            })
        );
    });

    it('Deve retornar todos os veículos cadastrados.', async () => {
        await app.inject({
            method: 'POST',
            url: '/vehicle',
            payload: {
                plate: 'ABC-1234'
            }
        });

        await app.inject({
            method: 'POST',
            url: '/vehicle',
            payload: {
                plate: 'XYZ-9876'
            }
        });

        const response = await app.inject({
            method: 'GET',
            url: '/vehicle'
        });

        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);

        expect(responseBody.vehicle).toHaveLength(2);
        const plates = responseBody.vehicle.map((v: any) => v.plate);
        expect(plates).toContain('ABC-1234');
        expect(plates).toContain('XYZ-9876');
    });
});
