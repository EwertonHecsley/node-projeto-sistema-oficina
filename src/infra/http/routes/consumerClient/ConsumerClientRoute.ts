import { FastifyInstance } from 'fastify';
import { ConsumerClientController } from '../../controllers/consumerClient/ConsumerClientController';
import { validateBody } from '../../middleware/validate';
import { createConsumerClientSchema } from '../../controllers/consumerClient/dto/consumerClientSchemaDto';
import { updateConsumerClientSchema } from '../../controllers/consumerClient/dto/consumerClientUpdateSchemaDto';
import { AddVehicleToClientDto } from '../../controllers/consumerClient/dto/addVehicleToClientSchemaDto';

export class ConsumerClientRoute {
  constructor(private readonly controller: ConsumerClientController) {}

  async register(app: FastifyInstance) {
    app.post('/consumerClient', {
      preHandler: validateBody(createConsumerClientSchema),
      handler: this.controller.store.bind(this.controller),
    });

    app.get('/consumerClient', {
      handler: this.controller.list.bind(this.controller),
    });

    app.get('/consumerClient/:id', {
      handler: this.controller.index.bind(this.controller),
    });

    app.put('/consumerClient/:id', {
      preHandler: validateBody(updateConsumerClientSchema),
      handler: this.controller.update.bind(this.controller),
    });

    app.delete('/consumerClient/:id', {
      handler: this.controller.destroy.bind(this.controller),
    });

    app.post('/consumerClient/addVehicle', {
      preHandler: validateBody(AddVehicleToClientDto),
      handler: this.controller.addVehicle.bind(this.controller),
    });
  }
}
