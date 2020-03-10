import {InferType, number, object, string} from 'yup'
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import Profile from './Profile'
import validatedModel from '../utils/validatedModel'

// Model Schema
const userSchema = object({
  discordId: string()
    .required(),

  authToken: string()
    .required(),

  stravaId: number()
    .notRequired(),

  refreshToken: string()
    .notRequired()
    .default(""),

  profile: object()
    .model(Profile)
    .notRequired()
})

const Validator = validatedModel(userSchema)

@Serializable()
export default class User extends Validator implements InferType<typeof userSchema> {
  /** Discord ID for this user */
  @JsonProperty()
  discordId: string;

  /** Strava profile ID */
  @JsonProperty()
  stravaId: number;  

  /** Randomly generated token used as an URL password for users to access custom settings */
  @JsonProperty()
  authToken: string;

  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  @JsonProperty()
  refreshToken: string;

  /** Profile status such as points, levels, etc */
  @JsonProperty()
  profile: Profile = new Profile();
}