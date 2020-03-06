import Context from './Context'
import * as flatten from 'flatten'
import Bastion, {SetupParameters} from './Bastion';
import * as express from 'express';

class Resolver {
  resolvers: ResolveHandler[] = [];

  public setup = (context: SetupParameters) => {}

  public handle = (context: Context) => {
    let idx = 0

    const next = () => {
      let resolver = this.resolvers[idx]
  
      if (!resolver) return;
  
      context.next = () => {
        idx++
        next()
      }
  
      resolver(context)
    }
  
    next() 
  }

  public use(...resolvers: Resolvable[]) {
    this.resolvers = flatten([
      this.resolvers, 
      getResolvers(...resolvers)
    ])
  }
}

export default Resolver

export type ResolveHandler = {
  (context: Context): void;
}

export const getResolvers = (...resolvers: Resolvable[]) => 
  resolvers.map(resolver => (resolver instanceof Resolver) 
    ? resolver.resolvers
    : resolver
  )

export type Resolvable = Resolver|ResolveHandler