import { buildApp } from "../buildApp";
import { InMemoryVeiculoRepository } from "../fakeRepository/InMemoryVeiculoRepository";

describe('E2E - Deletar Veículo', () => {
    let app: Awaited<ReturnType<typeof buildApp>>;

    beforeEach(async () => {
        app = await buildApp({
            vehicleRepository: new InMemoryVeiculoRepository()
        });
    });

    it('Deve deletar um veículo com sucesso ao passar ID válido', async () => {
        const createResponse = await app.inject({
            method: 'POST',
            url: '/vehicle',
            payload: {
                plate: 'DEL-1234'
            }
        });

        const createBody = JSON.parse(createResponse.body);
        const vehicleId = createBody.vehicle.id;

        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/vehicle/${vehicleId}`
        });

        expect(deleteResponse.statusCode).toBe(204);
    });

    it('Deve retornar erro 400 ao passar ID com formato inválido', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/vehicle/id-invalido'
        });

        expect(response.statusCode).toBe(400);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual({
            message: 'Parâmetros inválidos.'
        });
    });

    it('Deve retornar erro 404 ao tentar deletar veículo com ID que não existe', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/vehicle/3772e5ab-f8d5-4685-804f-f9551770eedc'
        });

        expect(response.statusCode).toBe(404);
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual({
            message: 'Veiculo nao encontrado.'
        });
    });
});
