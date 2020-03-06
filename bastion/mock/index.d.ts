import * as Discord from 'discord.js';

interface Message {
  author: {
    id: string;
    username: string;
  };
  content: string;
  channel: {
    id: string;
  }
}

interface SendLog {
  type: "send";
  to: string;
  message: any;
  options: Discord.MessageOptions;
}

type Log = SendLog;

interface LogJSON {
  history: Log[];
  reply: SendLog;
}

// export declare const run: (command: Command, msg: string|Message)=> Promise<LogJSON>;