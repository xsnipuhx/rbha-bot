import {ResolveHandler, use} from 'bastion'

import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../services/UserService'

const activityDemo: ResolveHandler = async function({reply, props}) {
  const user = props.get<User>("user")
  const client = new StravaClient(user)
  
  const activity = await client.getActivity('3163500160')
  
  reply(`${activity.name}`)
}

export default use(
  withUserProp,
  activityDemo
)