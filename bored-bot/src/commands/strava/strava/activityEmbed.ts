import Activity from './models/Activity'
import Athlete from './models/Athlete'
import {Embed} from 'bastion'
import StravaClient from './StravaClient'
import User from '../db/User'

// todo: move to service?
export async function getActivityDetails(athleteId: string, activityId: string) {
  const user = await User.findById({ stravaId: athleteId })

  const client = new StravaClient(user)
  const [activity, athlete] = await Promise.all([
    client.getActivity(activityId),
    client.getProfile()
  ])

  return {
    user,
    activity,
    athlete
  }
}