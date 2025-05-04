import fastfy from 'fastify';
import { VehicleRouter } from './infra/http/routes/vehicle/VehicleRoute';
import { VehicleOrmRepository } from './infra/database/repository/vehicle/vehiceORMRepository';
import { VehicleController } from './infra/http/controllers/vehicle/VehicleController';
import { ConsumerClietOrmRepository } from './infra/database/repository/consumerClient/ConsumeClientORMRepository';
import { ConsumerClientController } from './infra/http/controllers/consumerClient/ConsumerClientController';
import { ConsumerClientRoute } from './infra/http/routes/consumerClient/ConsumerClientRoute';

const app = fastfy();

const vehicleRepository = new VehicleOrmRepository();
const controller = new VehicleController(vehicleRepository);
const vehicleRoutes = new VehicleRouter(controller);

const consumerClientRepository = new ConsumerClietOrmRepository();
const consumerClientController = new ConsumerClientController(consumerClientRepository);
const consumerClientRoute = new ConsumerClientRoute(consumerClientController);

vehicleRoutes.register(app);
consumerClientRoute.register(app);

export default app;
