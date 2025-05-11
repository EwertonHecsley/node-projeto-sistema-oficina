import Fastify from 'fastify';
import { InMemoryVeiculoRepository } from './fakeRepository/InMemoryVeiculoRepository';
import { VehicleController } from '../../infra/http/controllers/vehicle/VehicleController';
import { VehicleRouter } from '../../infra/http/routes/vehicle/VehicleRoute';
import { InMemoryConsumerClientRepository } from './fakeRepository/InMemoryConsumerClientRepositoy';
import { ConsumerClientController } from '../../infra/http/controllers/consumerClient/ConsumerClientController';
import { ConsumerClientRoute } from '../../infra/http/routes/consumerClient/ConsumerClientRoute';

export async function buildApp(deps?: { vehicleRepository?: any; consumerClientRepository?: any }) {
  const app = Fastify();

  const vehicleRepository = deps?.vehicleRepository ?? new InMemoryVeiculoRepository();
  const consumerClientRepository =
    deps?.consumerClientRepository ?? new InMemoryConsumerClientRepository();

  const vehicleController = new VehicleController(vehicleRepository);
  const vehicleRouter = new VehicleRouter(vehicleController);

  const consumerClientController = new ConsumerClientController(
    consumerClientRepository,
    vehicleRepository,
  );
  const consumerClientRouter = new ConsumerClientRoute(consumerClientController);

  vehicleRouter.register(app);
  consumerClientRouter.register(app);

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(500).send({ message: 'Erro interno no servidor.' });
  });

  await app.ready();
  return app;
}
