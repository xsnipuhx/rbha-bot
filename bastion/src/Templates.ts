import Context from './Context'
import Resolver, { Resolvable, ResolveHandler } from './Resolver'


/** 
 * Given a context, will take the first word that comes after the command
 * \!cmd param
 **/
const getFirstParam: RouteParser = (context) => {
  const [, route] = context.message.content.split(" ")
  return route
}


/** 
 * This function lets you route based off the next word after the command.
 * It's helpful when you have a base command with plenty of options that do different functionality
 * @param parser Gets passed in the context, whichever string it returns is used for routing. By default uses the first word after the command
 **/
export const Router = (parser: RouteParser = getFirstParam) => {
  let routes = {}

  return {
    /**
     * Add a route
     * @param route 
     * @param resolver
    */
    use: (route: string, resolver: Resolvable) => {
      routes[route] = resolver
    },

    /**
     * If no routes match, resolve with this Resolver. If not set, the bot will simply not reply
     * @param resolver
     */
    default: (resolver: Resolvable) => {
      routes["_"] = resolver
    },

    /**
     * Return this to get the Resolver instance
     */
    getResolver: (): ResolveHandler => 
      (context: Context) => {
        const route = parser(context)
        const target = routes[route] || routes["_"] || null

        const resolver = new Resolver()

        resolver.use(target)

        target && resolver.handle(context)
      }
  }
}

interface RouteParser {
  (context: Context): string;
}

/** 
 * Shorthand method for creating a resolver that replies with a string
 * Shorthand for `({reply}) => reply(msg)`
 **/
export const reply = (msg: string): Resolvable => ({reply}) => reply(msg)


/** 
 * Shorthand method for creating a resolver, instead of  `new Resolver().use(resolver1, resolver2)`
 **/
export const use = (...resolvers: Resolvable[]) => {
  const resolver = new Resolver()
  resolver.use(...resolvers)
  return resolver
}


// /** Shorthand reply creator */
// export const restrict = (options: RestrictOptions): Resolver => 
//   ({channel, next, reply}) => {
//     if (options.channels.indexOf(channel.id) > -1) {
//       next()
//     } else if (options.rejectText) {
//       reply(options.rejectText)
//     }
//   }

// interface RestrictOptions {
//   channels: string[]
//   rejectText?: string
// }