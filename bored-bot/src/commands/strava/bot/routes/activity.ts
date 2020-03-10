import {Embed, ResolveHandler, use} from 'bastion'

import Activity from '../../strava/models/Activity'
import Athlete from '../../strava/models/Athlete'
import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../services/UserService'

const activityDemo: ResolveHandler = async function({channel, props}) {
  const user = props.get<User>("user")
  const client = new StravaClient(user)
  
  const athlete = await client.getProfile()
  const activity = await client.getActivity('3163500160')
  console.log(activity)
  
  const embed = activityEmbed(athlete, activity)

  channel.send(embed)
}

export default use(
  withUserProp,
  activityDemo
)