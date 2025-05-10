import { z } from 'zod';

const cpfRegex =
    /^(?:\d{11}|\d{14}|\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createMechanicSchema = z.object({
    name: z.string().nonempty('Campo nome nao pode ser vazio.'),
    cpf: z
        .string()
        .nonempty('Campo CPF nao pode ser vazio.')
        .regex(cpfRegex, 'Documento deve ser um CPF valido, com ou sem hifens.'),
    email: z
        .string()
        .nonempty('Campo email nao pode ser vazio.')
        .regex(emailRegex, 'Formato de email invalido.'),
    isAvaliable: z.boolean().optional().default(true)
})

export type CreateMechanicDto = z.infer<typeof createMechanicSchema>;