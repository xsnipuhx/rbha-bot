import {Config, mergeConfig} from './config'

import web from './router'
import command from './discord'

import './db/user.dao'

export default (options: Config) => {
  mergeConfig(options)

  return {
    command, 
    web
  }
}