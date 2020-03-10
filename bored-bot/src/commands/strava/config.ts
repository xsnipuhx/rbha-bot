export interface Config {
  /** client_id from strava developer portal */
  client_id: string;

  /** client_secret from strava developer portal */
  client_secret: string;

  /** Hostname this bot is hosted on. required for oAuth redirect */
  hostname: string;

  /** Prefix the strava API's. By default they're set to */
  basePath: string;

  /** When a strava create activity happens, which channel should we post the embed in */
  postActivityChannel: string;
}

// Initial config
const config: Config = {
  hostname: '',
  basePath: '/fit',
  client_id: '',
  client_secret: '',
  postActivityChannel: ''
}

export default config

export const mergeConfig = (options: Config) =>
  Object.keys(options) 
    .forEach( key => config[key] = options[key])
