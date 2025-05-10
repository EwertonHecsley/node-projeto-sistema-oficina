import { FastifyInstance } from 'fastify';
import { MechanicController } from '../../controllers/mechanic/MechanicController';
import { validateBody } from '../../middleware/validate';
import { createMechanicSchema } from '../../controllers/mechanic/dto/mechanicSchemaDto';
import { udateMechanicSchema } from '../../controllers/mechanic/dto/mechanicUpdateSchemaDto';

export class MechanicRoute {
  constructor(private readonly controller: MechanicController) {}

  async register(app: FastifyInstance) {
    app.post('/mechanic', {
      preHandler: validateBody(createMechanicSchema),
      handler: this.controller.store.bind(this.controller),
    });

    app.get('/mechanic', {
      handler: this.controller.list.bind(this.controller),
    });

    app.get('/mechanic/:id', {
      handler: this.controller.index.bind(this.controller),
    });

    app.put('/mechanic/:id', {
      preHandler: validateBody(udateMechanicSchema),
      handler: this.controller.update.bind(this.controller),
    });

    app.delete('/mechanic/:id', {
      handler: this.controller.destroy.bind(this.controller),
    });
  }
}
