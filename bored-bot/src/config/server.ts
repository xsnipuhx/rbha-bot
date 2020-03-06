import config from './config'

const mergeConfig = <T>(base: T, merge: Partial<T>): T => ({
  ...base,
  ...merge
})

const env_config = config[process.env.NODE_ENV] || {}

export default mergeConfig(config.development, env_config)