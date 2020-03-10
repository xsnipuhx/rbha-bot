import { ResolveHandler, Router } from 'bastion'

import Activity from './routes/activity'
import Auth from './routes/auth'
import Me from './routes/profile'

const helpText: ResolveHandler = ({reply, command}) => reply(`
**${command} auth** - Authorize your account with the bot
`)

const router = Router()

router.use('auth', Auth)
router.use('profile', Me)
router.use('activity', Activity)

router.default(helpText)

export default router.getResolver()