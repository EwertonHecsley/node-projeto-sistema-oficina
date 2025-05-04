import { FastifyInstance } from 'fastify';
import { ConsumerClientController } from '../../controllers/consumerClient/ConsumerClientController';
import { validateBody } from '../../middleware/validate';
import { createConsumerClientSchema } from '../../controllers/consumerClient/dto/consumerClientSchemaDto';

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
  }
}
