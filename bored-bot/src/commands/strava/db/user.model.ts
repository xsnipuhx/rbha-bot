import {object, string, InferType, ObjectSchema} from 'yup'
import validatedModel from '../utils/validatedModel'

// Validated model
const profileSchema = object({
  discordId: string()
    .required(),

  urlToken: string()
    .required(),

  refreshCode: string()
    .notRequired()
})

const Validator = validatedModel(profileSchema)

class User extends Validator {
  /** Discord ID for this user */
  discordId: string;

  /** Randomly generated token used as an URL password for users to access custom settings */
  urlToken: string;

  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  refreshCode: string = "";
}

export default User