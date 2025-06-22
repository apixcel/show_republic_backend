import { Module } from '@nestjs/common';
import { CustomValidationPipe } from './CustomValidationPipe';



@Module({
  imports: [
  CustomValidationPipe,
  ],

  controllers: [],
  providers: [],
  exports: [],
})
export class ValidatorsModule {}
