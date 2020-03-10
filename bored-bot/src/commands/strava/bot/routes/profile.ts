import {ResolveHandler, use} from 'bastion'

import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../services/UserService'

const printProfile: ResolveHandler = async ({reply, props}) => {
  const user = props.get<User>("user")
  const client = new StravaClient(user)
  
  // const profile = await client.getProfile()
  const activity = await client.getActivity('3163500160')
  const res = await client.getActivityHeartrate(activity.id)

  const hr = res.heartrate.data
  const time = res.time.data
  const last = time[time.length - 1]

  console.log(time.length, hr.length)

  const zones = await client.getHRZones()

  const Z = {
    'none': 0,
    'active': 0,
    'hard': 0
  }


  for (var i = 1; i < hr.length; i++) {
    const zone = zones.getIntensity(hr[i])
    let diff = time[i] - time[i - 1]
    
    Z[zone] += diff
  }

  console.log("zones!", Z)
  
  reply(`Hello! ${user.discordId}`)
}

export default use(
  withUserProp,
  printProfile
)