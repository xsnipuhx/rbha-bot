import * as Discord from 'discord.js';
import Resolver, {Resolvable} from './Resolver';
import Context from './Context';
import Debug from 'debug';
import Bastion from './Bastion';

const debug = Debug('bastion:router')

class Router {
  private resolvers = new Map<string, Resolver>();
  
  handle(msg: Discord.Message, bastion: Bastion) {
    const command = msg.content
      .split(" ")[0]
      .substring(1)

    debug(
      `resolve command`.gray, command.bold, 
      `from`.gray, msg.author.username.cyan, 
      `in`.gray, (msg.channel as Discord.TextChannel).name
    )

    const resolver = this.resolvers.get( command )
    if (!resolver) {
      debug(`command ${command} did not match any plugins`)
      return;
    }

    const context = new Context(msg, bastion)
    context.command = bastion.instigator + context.command

    resolver.handle(context)
  }

  use(command: string, ...resolvers: Resolvable[]) {
    debug(`adding command: ${command}`)
    let res = this.resolvers.get(command) || new Resolver()
    res.use(...resolvers) 

    this.resolvers.set(command, res)
  }
}

export default Router