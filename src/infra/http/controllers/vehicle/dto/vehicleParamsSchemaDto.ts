import { z } from 'zod';

export const vehicleIdParamSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido. Deve ser um UUID.' }),
});

export type VehicleIdParamDto = z.infer<typeof vehicleIdParamSchema>;
