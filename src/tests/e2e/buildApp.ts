import Fastify from 'fastify';
import { InMemoryVeiculoRepository } from './fakeRepository/InMemoryVeiculoRepository';
import { VehicleController } from '../../infra/http/controllers/vehicle/VehicleController';
import { VehicleRouter } from '../../infra/http/routes/vehicle/VehicleRoute';
import { InMemoryConsumerClientRepository } from './fakeRepository/InMemoryConsumerClientRepositoy';
import { ConsumerClientController } from '../../infra/http/controllers/consumerClient/ConsumerClientController';
import { ConsumerClientRoute } from '../../infra/http/routes/consumerClient/ConsumerClientRoute';

export async function buildApp(deps?: { vehicleRepository?: any; consumerClientRepository: any }) {
  const app = Fastify();

  const repository = deps?.vehicleRepository ?? new InMemoryVeiculoRepository();
  const controller = new VehicleController(repository);
  const router = new VehicleRouter(controller);

  const consumerClientRepository =
    deps?.consumerClientRepository ?? new InMemoryConsumerClientRepository();
  const controllerConsumerClient = new ConsumerClientController(
    consumerClientRepository,
    repository,
  );
  const routerConsumerClient = new ConsumerClientRoute(controllerConsumerClient);

  router.register(app);
  routerConsumerClient.register(app);

  await app.ready();
  return app;
}
