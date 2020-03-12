import {ResolveHandler, use} from 'bastion'

import {findOrCreateUser} from '../../services/user-service'
import {getConnectUrl} from '../../services/auth-service'

const sendConnectUrl: ResolveHandler = async ({reply, member, props}) => {
  const user = await findOrCreateUser(member.id)
  const authUrl = await getConnectUrl(user)

  return Promise.all([
    member.send(`
Welcome to the #fitness channel! Before you can participate, you must connect your strava account to the bot. 

To do that, visit here and click "Authorize": ${authUrl}

This will give the bot permission to read activities from your profile. This URL is also your login for managing your settings, so keep it secret!
    `),
    reply(`DM'd you, ${member.displayName}!`)
  ])
}

export default use(
  sendConnectUrl
)