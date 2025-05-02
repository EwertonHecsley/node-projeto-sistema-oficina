import { FastifyInstance } from 'fastify';
import { VehicleController } from '../../controllers/vehicle/VehicleController';
import { validateBody } from '../../middleware/validate';
import { createVehicleSchema } from '../../controllers/vehicle/dto/vehicleSchemaDto';

export class VehicleRouter {
  private readonly controller = new VehicleController();

  async register(app: FastifyInstance) {
    app.post('/vehicle', {
      preHandler: validateBody(createVehicleSchema),
      handler: this.controller.store.bind(this.controller),
    }),
      app.get('/vehicle', {
        handler: this.controller.list.bind(this.controller),
      });
  }
}
