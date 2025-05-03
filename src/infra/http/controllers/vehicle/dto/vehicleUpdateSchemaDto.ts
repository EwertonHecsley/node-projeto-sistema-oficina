import { z } from 'zod';

export const updateVehicleSchema = z.object({
  plate: z.string().nonempty('Campo placa nao pode ser vazio para atualizacao'),
});

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
