// src/modules/consumer-client/dtos/add-vehicle.dto.ts
import { z } from 'zod';

export const AddVehicleToClientDto = z.object({
  clientId: z.string().uuid({ message: 'ID do cliente inválido' }),
  plate: z.string().min(1, { message: 'Placa do veículo é obrigatória' }),
});

export type AddVehicleToClientInput = z.infer<typeof AddVehicleToClientDto>;
