import {InferType, number, object} from 'yup'
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import validatedModel from '../utils/validatedModel'

// Validated model
const profileSchema = object({
  points: number()
    .required()
})

const Validator = validatedModel(profileSchema)

@Serializable()
export default class Profile extends Validator implements InferType<typeof profileSchema> {
  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  @JsonProperty()
  points: number = 0;
}