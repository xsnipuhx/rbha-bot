import Activity from "../../strava/models/Activity"
import {Embed} from 'bastion'

const runIcon = 'https://imgur.com/MBdosZu.png'
const bikeIcon = 'https://imgur.com/GKv60ee.png'
const hikeIcon = 'https://i.imgur.com/yngECpK.png'

export default function activityEmbed(data: ActivityEmbedData) {
  const verb = data.activity.manual ? 'logged' : 'recorded'
  const embed = new Embed()
    .setColor("fc4c02")
    .setAuthor(`${data.username} ${verb} a ${data.activity.type}!`, data.avatar)
    .setThumbnail(runIcon)
    .setTitle(data.activity.name)
    .setDescription(data.activity.description)
    .setFooter('From ' + data.activity.device_name)


  embed
    .addField("Distance",  data.activity.distance, true)
    .addField("Time",      data.activity.moving_time.toTime(), true)
    .addField("Pace",      data.activity.averagePace.toPace(), true)

  const totalPoints = data.activePoints + data.hardPoints
  embed.addField('Points', '+' + totalPoints + ' `♥ +' + data.activePoints + '` `♥♥ +' + data.hardPoints + '`')

  return embed;
}

interface ActivityEmbedData {
  username: string;
  avatar: string;
  activity: Activity;
  activePoints: number;
  hardPoints: number;
}