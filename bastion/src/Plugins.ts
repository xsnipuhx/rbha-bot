import Bastion from './Bastion'
import Debug from 'debug'

const debug = Debug('bastion:plugin')

export class BastionPlugin {
  name = '';
  public init(bastion?: Bastion) {}
}

export class PluginsManager {
  plugins: Map<string, BastionPlugin>;

  constructor(private bastion: Bastion) {
    this.plugins = new Map();
  }

  addPlugin = (plugin: BastionPlugin) => {
    if (!plugin.name) throw `Plugin must have a unique name`;
    if (this.plugins.has(plugin.name)) {
      debug(`⚠️ Plugin ${plugin.name} conflicts with another plugin`.yellow)
    }

    debug(`Adding plugin ${plugin.name}`)
    this.plugins.set(plugin.name, plugin);
  }

  /** Call init() on all plugins. Meant to be called when bot is ready to connect */
  initialize = () => {
    [...this.plugins.keys()]
      .forEach( key => 
        this.plugins
          .get(key)
          .init(this.bastion)
      )
  }
}