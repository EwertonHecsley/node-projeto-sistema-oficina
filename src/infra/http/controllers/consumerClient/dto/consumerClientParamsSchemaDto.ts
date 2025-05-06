import { z } from 'zod';

export const consumerClientParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido. Deve ser um UUID.' }),
});

export type ConsumerClientParamsDto = z.infer<typeof consumerClientParamsSchema>;
