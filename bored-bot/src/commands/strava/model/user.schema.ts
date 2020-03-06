import {MongoConnection} from 'bastion'
import {Schema, Document} from 'mongoose'
import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import {object, string} from 'yup'

export interface UserDocument extends Document {
  discordId: string;
  url_token: string;
  refresh_code: string;

  acceptToken(code: string): Promise<void>;
}

const Profile = createSchema({
  points: Type.number({ default: 0 })
})

const UserSchema = createSchema({
  discordId: Type.string({ required: true, index: true }),
  url_token: Type.string({ required: true }),

  strava: Type.object().of({
    id: Type.string(),
    refresh_code: Type.string()
  }),

  profile: Type.schema({ default: Profile }).of(Profile)
})

type UserDoc = ExtractDoc<typeof UserSchema>;

export default typedModel('fit-user', UserSchema, undefined, undefined, undefined, MongoConnection)