import fastfy from 'fastify';
import { VehicleRouter } from './infra/http/routes/vehicle/VehicleRoute';

const app = fastfy();

const vehicleRoutes = new VehicleRouter();
vehicleRoutes.register(app);

export default app;
