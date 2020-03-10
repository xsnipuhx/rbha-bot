import * as express from 'express'

import Bastion, {BastionPlugin} from 'bastion'

import Debug from 'Debug'

const debug = Debug('bastion-plugin:express')

interface ExpressConfig {
  /** What port to run on */
  port?: number|string;
}

export default class BastionExpress extends BastionPlugin {
  // Uniquely identify this plugin
  public name = "bastion-express";

  // Reference to the running express application
  public app: express.Application;

  private config: ExpressConfig;

  private _bastion: Bastion;

  private get bastion() {
    return this._bastion;
  }


  constructor(config: ExpressConfig = {}) {
    super();
    this.config = config
    this.app = express()

    this.setupMiddleware()
  }

  /**
   * Setup up express middleware.
   * We do this before `init()` since init doesn't get called until we connect,
   * and user may be already trying to add handlers before then
   */ 
  setupMiddleware() {
    this.app.use(express.json({ 
      type: "application/json"
    }))

    // Attach reference to bastion middleware
    this.app.use((req, res, next) => {
      // @ts-ignore
      req.bastion = this.bastion
      next()
    })
  }

  /**
   * Initialize this plugin.
   * Boots up an express server and sets up the Bastion middleware
   */
  init(bastion: Bastion) {
    this._bastion = bastion;
    const port = this.config.port || 5000

    // Default status page
    this.app.use("/bastion", (_, res) => res.send("Bot is up and running!"))

    this.app.listen(
      port,
      () => debug(`Running web server on port ${port}`)  
    )
  }

  /**
   * Shorthand for Express.use
   */
  public use(...args) {
    this.app.use(...args)
  }
}