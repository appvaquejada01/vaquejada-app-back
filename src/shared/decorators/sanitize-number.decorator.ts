import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function SanitizeNumber(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sanitizeNumber',
      target: object.constructor,
      propertyName: propertyName,
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^\d+$/.test(value.replace(/\D/g, ''));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve conter apenas números.`;
        },
      },
      async: false,
    });
  };
}

export function sanitizeToNumbers(value: string): string {
  return value.replace(/\D/g, '');
}
