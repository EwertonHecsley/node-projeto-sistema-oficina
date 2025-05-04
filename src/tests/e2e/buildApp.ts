import Fastify from 'fastify';
import { InMemoryVeiculoRepository } from './fakeRepository/InMemoryVeiculoRepository';
import { VehicleController } from '../../infra/http/controllers/vehicle/VehicleController';
import { VehicleRouter } from '../../infra/http/routes/vehicle/VehicleRoute';

export async function buildApp(deps?: { vehicleRepository?: any }) {
  const app = Fastify();

  const repository = deps?.vehicleRepository ?? new InMemoryVeiculoRepository();
  const controller = new VehicleController(repository);
  const router = new VehicleRouter(controller);

  router.register(app);

  await app.ready();
  return app;
}
