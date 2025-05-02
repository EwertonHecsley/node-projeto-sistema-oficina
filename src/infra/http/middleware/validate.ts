import { ZodSchema } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

export function validateBody<T extends ZodSchema>(schema: T) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            return reply.status(400).send({
                message: 'Dados inválidos.',
                issues: result.error.format(),
            });
        }

        request.body = result.data;
    };
}
