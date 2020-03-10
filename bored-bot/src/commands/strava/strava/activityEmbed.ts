import Activity from './models/Activity'
import Athlete from './models/Athlete'
import {Embed} from 'bastion'
import StravaClient from './StravaClient'
import UserDao from '../db/UserDao'

const userDao = new UserDao()

// todo: move to service?
export async function getActivityDetails(athleteId: string, activityId: string) {
  const user = await userDao.findByStravaId(athleteId)
  if (!user) {
    throw new Error("User doesn't exist")
  }

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

export function createActivityEmbed(username: string, athlete: Athlete, activity: Activity) {
  return new Embed()
    .setColor("fc4c02")
    .setAuthor(username + " posted a run", athlete.profile)
    .setTitle(activity.name)
    .setDescription(activity.description)
    // .setThumbnail(athlete.profile)
    .addBlankField()
    .addField("Distance", activity.distance.toMiles().toFixed(2) + "mi", true)
    .addField("Time", activity.moving_time.hhmmss(), true)
    .addField("Pace", activity.average_pace.hhmmss() + '/mi', true)
    .addField("Heart Rate", Math.floor(activity.average_heartrate), true)
    .addField("Points", `\`♥\` +4.5 \`♥♥\` +6.2`, true)
    .setFooter(`From ${activity.device_name}`)
}