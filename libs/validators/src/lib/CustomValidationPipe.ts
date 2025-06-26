import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  override createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      // Process each error individually
      const errorMessages = validationErrors
        .map((error) => {
          // Extract the constraints and split them by comma
          const constraints = Object.values(error.constraints || {}).flatMap(
            (constraint) => constraint.split(', ').map((msg) => msg.trim()),
          );

          // Return the adjusted constraints
          return constraints;
        })
        .flat();

      // Here, we return a single error from the list each time
      return new BadRequestException(errorMessages[0]);
    };
  }
}
