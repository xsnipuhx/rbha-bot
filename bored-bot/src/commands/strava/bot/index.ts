import { ResolveHandler, Router } from 'bastion'

import Auth from './routes/auth'
import Me from './routes/profile'

const helpText: ResolveHandler = ({reply, command}) => reply(`
**${command} auth** - Authorize your account with the bot
`)

const router = Router()

router.use('auth', Auth)
router.use('profile', Me)

router.default(helpText)

export default router.getResolver()