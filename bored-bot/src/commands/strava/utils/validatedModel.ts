import {InferType, ObjectSchema} from 'yup';
import { JsonProperty, Serializable, deserialize, serialize } from 'typescript-json-serializer';

/** 
 * This creates a class you can extend from, that applies JSON from the constructor as props and a validate() function
 * 
 * @example
 *   const Validated = validateModel(schema)
 *   class Model extends Validated {}
 **/

export default <T extends ObjectSchema<object>>(schema: T) => class Validator {

  /**
   * Creates an instance of the class with the properties
   * 
   * @param json Json object to deserialize into class
   */
  public static from<U extends Validator>(this: new (props?: InferType<T>) => U, json: InferType<T>) {
    return deserialize(json, this)
  }

  /**
   * Runs validation on a model. This static method is useful if you want quick validation before instantiating the class
   * 
   * @param val Validate json
   */
  public static validate(val: any) {
    return schema.validateSync(val)
  }

  /**
   * Validate this model. Will throw an error if validation fails
   */
  public validate() {
    const json = this.json()
    return schema.validateSync(json)
  }

  /**
   * Validate this model, but do not throw an error
   */
  public isValid() {
    const json = this.json()
    return schema.isValidSync(json)
  }

  /**
   * Serializes the model to JSON
   */
  public json(): InferType<T> {
    return serialize(this)
  }
}