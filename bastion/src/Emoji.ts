import * as Discord from 'discord.js'

export class Emoji {
  public name: string;
  public id: string;

  private client: Discord.Client;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
  }

  public setClient(client: Discord.Client) {
    this.client = client;
  }
}

Emoji.prototype.toString = function() {
  if (!this.client) {
    console.error(`Cannot use emoji '${this.name}': Client not set. Please use bastion.register(emojis) to configure emojis`.red)
    return null;
  }

  return this.client.emojis.get(this.id).toString()
}

/** 
 * Index emojis by Name->Id
 **/
export const defineEmojis = <T>(emojis: EmojiConfig<T>) => {
  let ch = {}
  for (var k in emojis) {
    // This is pissing me off and idk how to fix it,
    // throwing some weird error about "eXtRaCt" because of the generic
    // so lets just tell TS to ignore it lmao works fine
    // @ts-ignore
    ch[k] = new Emoji(k, emojis[k])
  }
  return ch as Emojis<T>;
}

type Emojis<T> = {
  [K in keyof T]: Emoji;
}

type EmojiConfig<T> = {
  [K in keyof T]: T[K]
}
