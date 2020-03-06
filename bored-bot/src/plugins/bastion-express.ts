import Bastion, {BastionPlugin} from 'bastion'
import * as express from 'express'
import Debug from 'Debug'

const debug = Debug('bastion-plugin:express')

interface ExpressConfig {
  /** What port to run on */
  port?: number|string;
}

export default class BastionExpress extends BastionPlugin {
  public name = "bastion-express";
  public app: express.Application;

  private config: ExpressConfig;

  constructor(config: ExpressConfig = {}) {
    super();
    this.config = config
    this.app = express()
  }

  init(bastion: Bastion) {
    const port = this.config.port || 5000

    // Attach reference to bastion middleware
    this.app.use((req, res, next) => {
      // @ts-ignore
      req.bastion = bastion
      next()
    })

    this.app.use("/bastion", (_, res) => res.send("Bot is up and running!"))

    this.app.listen(
      port,
      () => debug(`Running web server on port ${port}`)  
    )
  }

  public use(...args) {
    this.app.use(...args)
  }
}