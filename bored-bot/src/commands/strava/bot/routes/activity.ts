import * as ActivityService from '../../services/activity-service'
import * as ProfileService from '../../services/profile-service'

import {Embed, ResolveHandler, use} from 'bastion'

import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../middlewares/user-middleware'

const printProfile: ResolveHandler = async ({reply, member, props}) => {
  const user = props.get<User>("user")

  // todo: move to service
  const client = new StravaClient(user)

  const activity = await client.getActivity('3172681688')
  ProfileService.addActivityEffort(user, activity)
  // const [zones, stream] = await Promise.all([
  //   client.getHRZones(),
  //   client.getActivityStreams('3172681688')
  // ])

  // const intensity = ActivityService.calculateTimeInZones(zones, stream)
  // console.log("active seconds", intensity.active)
  // console.log("Active: " + intensity.active.toTime() + " Hard: " + intensity.hard.toTime())
  // // const profile = await client.getActivity()
  
  reply('done!')
}

export default use(
  withUserProp,
  printProfile
)