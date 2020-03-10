import {ResolveHandler, use} from 'bastion'

import {getConnectUrl} from '../../services/AuthService'

const sendConnectUrl: ResolveHandler = async ({reply, user, props}) => {
  const authUrl = await getConnectUrl(user.id)

  return Promise.all([
    user.send(`
Welcome to the #fitness channel! Before you can participate, you must connect your strava account to the bot. 

To do that, visit here and click "Authorize": ${authUrl}

This will give the bot permission to read activities from your profile. This URL is also your login for managing your settings, so keep it secret!
    `),
    reply(`DM'd you, ${user.displayName}!`)
  ])
}

export default use(
  sendConnectUrl
)