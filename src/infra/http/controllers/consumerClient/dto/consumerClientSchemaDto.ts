import { z } from 'zod';

const cpfCnpjRegex =
  /^(?:\d{11}|\d{14}|\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createConsumerClientSchema = z.object({
  name: z.string().nonempty('Campo nome nao pode ser vazio.'),
  documentType: z
    .string()
    .nonempty('Campo documento nao pode ser vazio.')
    .regex(cpfCnpjRegex, 'Documento deve ser um CPF ou CNPJ válido, com ou sem pontuação.'),
  email: z
    .string()
    .nonempty('Campo email nao pode ser vazio.')
    .regex(emailRegex, 'Formato de email invalido.'),
  phone: z.string().nonempty('Campo telefone nao pode ser vazio.'),
  city: z.string().nonempty('Campo cidade nao pode ser vazio.'),
  juridicalPerson: z.boolean(),
});

export type CreateConsumerClientDto = z.infer<typeof createConsumerClientSchema>;
