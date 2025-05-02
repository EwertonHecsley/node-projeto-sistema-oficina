import { z } from 'zod';

export const createVehicleSchema = z.object({
  plate: z.string().nonempty('Campo placa nao pode ser vazio.'),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
