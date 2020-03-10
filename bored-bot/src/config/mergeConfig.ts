import config from './config'

const env = process.env.NODE_ENV

const mergeConfig = <T>(base: T, merge: Partial<T>): T => ({
  ...base,
  ...merge
})

const env_config = env ? config[env] : {}

export default mergeConfig(config.development, env_config)