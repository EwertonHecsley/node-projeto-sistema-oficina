import { z } from 'zod';

const cpfCnpjRegex =
  /^(?:\d{11}|\d{14}|\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const updateConsumerClientSchema = z.object({
  name: z.string().optional(),
  documentType: z
    .string()
    .regex(cpfCnpjRegex, 'Documento deve ser um CPF ou CNPJ válido, com ou sem pontuação.')
    .optional(),
  email: z.string().regex(emailRegex, 'Formato de email invalido.').optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  juridicalPerson: z.boolean().optional(),
});

export type UpdateConsumerClientDto = z.infer<typeof updateConsumerClientSchema>;
