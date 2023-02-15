import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { MyModelStatic } from '../database/database.static-model';

async function slugHasToBeUnique(slug: string, model: MyModelStatic): Promise<boolean> {
  return !(await model.findOne({ where: { slug } }));
}

export function UniqueSlug(model: MyModelStatic, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Unique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return await slugHasToBeUnique(value, relatedPropertyName);
        }
      }
    });
  };
}
