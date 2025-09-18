import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
export class CpfAlreadyInUseException extends HttpException {
  constructor() {
    super('CPF number already in use', HttpStatus.CONFLICT);
  }
}

export class EmailAlreadyInUseException extends HttpException {
  constructor() {
    super('Email address already in use', HttpStatus.CONFLICT);
  }
}
