// Extend yup
import {object, addMethod} from 'yup'

/** For nested Validation models */
addMethod(object, 'model', function(Model) {
  return this.transform( value => Model.from(value))
});

declare module 'yup' {
  interface ObjectSchema {
    model<T>(props: T): ObjectSchema<object>
  }
}
