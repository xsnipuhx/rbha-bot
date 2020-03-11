import {ResolveHandler, use} from 'bastion'

import StravaClient from '../../strava/StravaClient'
import User from '../../db/User'
import {withUserProp} from '../middlewares/user-middleware'

const printProfile: ResolveHandler = async ({reply, props}) => {
  const user = props.get<User>("user")
  const client = new StravaClient(user)
  
  // const profile = await client.getProfile()
  
  reply(`Stats!`)
}

export default use(
  withUserProp,
  printProfile
)