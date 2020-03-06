import { Router, use, ResolveHandler } from 'bastion'
import Auth from './bot/auth.controller'

const helpText: ResolveHandler = ({reply, command}) => reply(`
**${command} auth** - Authorize your account with the bot
`)

const router = Router()

router.use('auth', (Auth))
router.default(helpText)

export default router.getResolver()