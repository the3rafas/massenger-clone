import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidFilePath(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'FilePath',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          if (typeof value === 'string' && value.search('http') > -1) {
            return false;
          } else if (typeof value === 'object') {
            if (
              (value.documentPicture !== undefined && value.documentPicture.search('http') > -1) ||
              (value.schsPicture !== undefined && value.schsPicture.search('http') > -1)
            )
              return false;
          }
          return true;
        }
      }
    });
  };
}
