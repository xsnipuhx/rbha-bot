import {Embed, ResolveHandler, use} from 'bastion'

import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../middlewares/user-middleware'

const printProfile: ResolveHandler = async ({reply, member, props}) => {
  const user = props.get<User>("user")

  // todo: move to embeds
  const embed = new Embed()
    .setAuthor(member.displayName, member.user.avatarURL)
    .addField("Level", user.profile.level, true)
    .addField("Points", user.profile.points, true)
    .addField("To Next Level", (user.profile.pointsPerLevel - user.profile.pointsThisLevel).toFixed(1), true)
    .addField("Streak", user.profile.streak, true)
  
  reply(embed)
}

export default use(
  withUserProp,
  printProfile
)