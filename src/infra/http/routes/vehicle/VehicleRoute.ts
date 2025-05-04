import { FastifyInstance } from 'fastify';
import { VehicleController } from '../../controllers/vehicle/VehicleController';
import { validateBody } from '../../middleware/validate';
import { createVehicleSchema } from '../../controllers/vehicle/dto/vehicleSchemaDto';
import { updateVehicleSchema } from '../../controllers/vehicle/dto/vehicleUpdateSchemaDto';

export class VehicleRouter {
  constructor(private readonly controller: VehicleController) {}

  async register(app: FastifyInstance) {
    app.post('/vehicle', {
      preHandler: validateBody(createVehicleSchema),
      handler: this.controller.store.bind(this.controller),
    });

    app.get('/vehicle', {
      handler: this.controller.list.bind(this.controller),
    });

    app.get('/vehicle/:id', {
      handler: this.controller.index.bind(this.controller),
    });

    app.delete('/vehicle/:id', {
      handler: this.controller.destroy.bind(this.controller),
    });

    app.put('/vehicle/:id', {
      preHandler: validateBody(updateVehicleSchema),
      handler: this.controller.update.bind(this.controller),
    });
  }
}
