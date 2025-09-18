import { HttpException, HttpStatus } from '@nestjs/common';

export class CpfAlreadyInUseException extends HttpException {
  constructor() {
    super('CPF number already in use', HttpStatus.CONFLICT);
  }
}
