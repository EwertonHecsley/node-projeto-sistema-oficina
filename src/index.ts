import fastfy from 'fastify';
import { VehicleRouter } from './infra/http/routes/vehicle/VehicleRoute';
import { VehicleOrmRepository } from './infra/database/repository/vehicle/vehiceORMRepository';
import { VehicleController } from './infra/http/controllers/vehicle/VehicleController';

const app = fastfy();

const vehicleRepository = new VehicleOrmRepository();
const controller = new VehicleController(vehicleRepository);
const vehicleRoutes = new VehicleRouter(controller);

vehicleRoutes.register(app);

export default app;
