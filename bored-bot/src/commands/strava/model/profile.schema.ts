import {Schema} from 'mongoose'

export interface ProfileDocument extends Document {
  points: number;
}

const Profile: Schema<ProfileDocument> = new Schema({
  points: { type: Number, default: 0 }
})

export default Profile