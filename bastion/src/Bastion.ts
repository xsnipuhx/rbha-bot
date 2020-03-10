import * as Discord from 'discord.js'

import {BastionPlugin, PluginsManager} from './Plugins'
import Resolver, {Resolvable} from './Resolver'

import Debug from 'debug'
import Router from './Router'

const debug = Debug("bastion:core")

export default class Bastion {
  /** Reference to Discord.js Client */
  public client: Discord.Client;

  private router: Router;

  private pluginsManager: PluginsManager;

  private options: BastionOptions = {
    token: "",
    instigator: "!"
  };

  constructor(options: BastionOptions) {
    this.options = Object.assign({}, this.options, options)

    this.pluginsManager = new PluginsManager(this);
    this.client = new Discord.Client();
    this.router = new Router();

    this.client.on('ready', () => {
      debug(`✓`.green, `Connected!`, `${this.client.user.tag}`.magenta)
    })
    this.client.on('message', this.onMessage)
  }

  /** Event handler for when Dicsord bot recieves a message */
  private onMessage = (msg: Discord.Message) => {
    // Ignore self
    if (msg.author.bot) return;

    if (msg.content.startsWith(this.options.instigator)) {
      this.router.handle(msg, this)
    }
  }

  /** 
   * Set up a command. A resolver
   * @param command The command to use to initiate the command
   * @param resolvers A sequence of command resolvers. The bot will call them one after another, as long as they call `next()`
   */
  public use(command: string, ...resolvers: Resolvable[]) {
    this.router.use(command, ...resolvers)
  }

  /**
   * Adds a plugin 
   */
  public plugins(plugins: BastionPlugin[]) {
    plugins.forEach(this.pluginsManager.addPlugin)
  }

  /**
   * Get the instigator option to start a command
   */
  public get instigator() {
    return this.options.instigator
  }

  /**
   * Connect the bot to discord. Use this to login the bot and go online
   */
  public async connect() {
    await this.client.login(this.options.token)
    this.pluginsManager.initialize()
  }

  /**
   * Shorthand to get a discord channel by it's ID
   * @param id The id of the channel
   */
  public channel(id: string) {
    return this.client.channels.get(id) as Discord.TextChannel
  }
}

interface BastionOptions {
  /** The Discord API token from the developer portal */
  token: string;
  /** The character used to initiate a discord command */
  instigator?: string;
}

export interface SetupParameters {
  bastion: Bastion;
}