// src/shared/utils/environment-validator.ts
import { z } from "zod";
import { logger } from "./logger";


export default class EnvironmentValidator {
    private readonly envSchema = z
        .object({
            NODE_ENV: z.enum(["development", "production", "test"]),
            PORT: z.string().regex(/^\d+$/).transform(Number)
        })
        .passthrough();

    public validateEnvironmentVariables(): void {
        const result = this.envSchema.safeParse(process.env);

        if (!result.success) {
            logger.warn("Error validating environment variables:", result.error.format());
            process.exit(1);
        }

        const env = result.data;

        switch (env.NODE_ENV) {
            case "development":
                logger.info("Environment is set to development.");
                break;
            case "production":
                logger.info("Environment is set to production.");
                break;
            case "test":
                logger.info("Environment is set to test.");
                break;
        }

        logger.info("Validating environment variables");
    }
}
