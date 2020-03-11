import Activity from "../../strava/models/Activity"
import {Embed} from 'bastion'

export default function activityEmbed(username: string, avatar: string, activity: Activity) {
  return new Embed()
    .setColor("fc4c02")
    .setAuthor(username + " posted a run", avatar)
    .setTitle(activity.name)
    .setDescription(activity.description)
    // .setThumbnail(athlete.profile)
    .addField("Distance",   activity.distance, true)
    .addField("Time",       activity.moving_time.toTime(), true)
    .addField("Pace",       activity.averagePace.toPace(), true)
    .addField("Heart Rate", activity.averageHeartrate, true)
    .addField("Points",     `\`♥\` +4.5 \`♥♥\` +6.2`,  true)
    .setFooter('From' + activity.device_name)
}