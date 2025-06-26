import { validateSync, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvironmentType } from '@show-republic/types'; // Adjust the path accordingly
import { ConfigModule } from '@nestjs/config';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentType, config, {
    enableImplicitConversion: true,
  });

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    // Collect error messages
    const errorMessages = errors
      .map(
        (error) =>
          Object.values(error.constraints || {}).map((message) => message) // Check if constraints is defined
      )
      .flat(); // Flatten the array of messages

    throw new Error(
      `Configuration validation error: ${errorMessages.join(', ')}`
    );
  }

  return validatedConfig;
}

export const ConfigModuleImport = ConfigModule.forRoot({
  isGlobal: true,
  cache: true,
  validate,
});
