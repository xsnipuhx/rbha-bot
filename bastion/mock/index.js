import {Message} from 'discord.js'
import { Bastion, Command, Action, Route, createCommand, Channels, Emojis, Context } from '../src/index'
import {Channel} from '../src/Channel'
import {exec} from '../src/exec'

import { EventEmitter } from 'events'

const Spy = new EventEmitter()

const randomId = () => Math.floor(Math.random()*1000)
/**
 * A Log gets created whenever a Command is executed
 * It's use is to keep track the bot's interaction with the discord by overriding any interaction and logging it here instead
 */
class Log {

  history = []

  constructor() {
    const onSend = this.listen("send")

    Spy.on("send", onSend)

    // Remove listeners
    this.stop = () => {
      Spy.removeListener("send", onSend)
    }
  }

  listen(type) {
    return (args) => {
      this.history.push({
        type,
        ...args
      })
    }
  }

  toJSON() {
    return {
      history: this.history,
      reply: this.history.filter(l => l.type === 'send').slice(-1)[0]
    }
  }
}

/** Override the send method to a channel */
Channel.prototype.send = function(message, options) {
  Spy.emit("send", {
    to: this.id,
    message: message,
    options: options
  })
}

Channel.prototype.type = function(){}

/** Default incoming message object to mock */
const defaultMessage = {
  author: {
    id: "mock-user",
    username: "bob"
  },
  content: "",
  channel: {
    id: randomId()
  }
}

/** Runs the command */
const run = async (command, msg) => {
  msg = typeof msg === 'string' ? { content: msg } : msg

  const log = new Log()

  await exec(command, {
    ...defaultMessage,
    ...msg
  })

  log.stop()

  return log.toJSON()
}

export { run }