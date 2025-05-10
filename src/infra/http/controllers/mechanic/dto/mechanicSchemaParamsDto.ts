import { z } from 'zod';

export const mechanicParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido. Deve ser um UUID.' }),
});

export type MechanicParamsDto = z.infer<typeof mechanicParamsSchema>;
