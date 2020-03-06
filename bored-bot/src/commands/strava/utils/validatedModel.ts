import {ObjectSchema, InferType} from 'yup';


/** 
 * This creates a class you can extend from, that applies JSON from the constructor as props and a validate() function
 **/
export default (schema: ObjectSchema<object>) => class Validator {
  constructor(props?: InferType<typeof schema>) {
    Object.assign(this, schema.cast(props, { stripUnknown: true }))
  }

  public validator(model: any) {
    schema.validateSync(model)
  }
}