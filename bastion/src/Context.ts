import * as Discord from 'discord.js'
import Bastion from './Bastion';

export default class Context {
  /** The user who sent the message */
  public user: Discord.GuildMember;

  /** Contents of the incoming message */
  public message: Discord.Message;

  /** The source channel of the message */
  public channel: Discord.TextChannel;

  /** Map to allow attaching data between routes */
  public props: Dictionary;

  /** The command used to initiate the current command */
  public command: string;
  
  /** Reference to the Discord.js library client */
  public client: Discord.Client;

  constructor(msg: Discord.Message, bastion: Bastion) {
    this.user = msg.member;
    this.message = msg;
    this.channel = msg.channel as Discord.TextChannel;
    this.props = new Dictionary()
    this.client = bastion.client
  }

  /* Set by dependency injection */
  /** If more functions in a chain, run the next one */
  next = () => {}

  /** Send a message back to the channel that the incoming message was sent to */
  reply = (msg: string) => {
    return this.channel.send(msg)
  }
}

/** This class exists just to get easier type mapping for get */
class Dictionary {
  private dict: Map<string, any> = new Map()

  public get<T>(key: string) {
    return this.dict.get(key) as T
  }

  public set(key: string, val: any) {
    this.dict.set(key, val)
  }
}