import {Config, mergeConfig} from './config'

import botRouter from './bot'
import webRouter from './www/backend'

export default (options: Config) => {
  mergeConfig(options)

  return {
    command: botRouter, 
    web: webRouter
  }
}