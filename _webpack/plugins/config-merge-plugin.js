const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

class ConfigMergePlugin {
  constructor (options = {}) {
    this.configFiles = options.configFiles || '_config.yml'
    this.envVar = options.envVar || 'config'
    this.watch = options.watch !== false // Default to true
  }

  apply (compiler) {
    const pluginName = 'ConfigMergePlugin'

    // Load and merge config files before compilation
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const mergedConfig = this.loadAndMergeConfigs(this.configFiles)

        // Override baseurl if provided via command line
        if (process.env.baseurl !== null) {
          mergedConfig.baseurl = process.env.baseurl
          console.log(`✓ Overriding baseurl with command-line value: '${process.env.baseurl}'`)
        }

        // Add the merged config to DefinePlugin as a direct object
        // DefinePlugin will replace process.env.config with the actual object literal
        const envVars = {
          [`process.env.${this.envVar}`]: JSON.stringify(mergedConfig)
        }

        const definePlugin = new webpack.DefinePlugin(envVars)
        definePlugin.apply(compiler)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Watch for changes in config files during development
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      if (this.watch) {
        const configPaths = this.configFiles.split(',')
        configPaths.forEach(configPath => {
          const fullPath = path.resolve(process.cwd(), configPath.trim())
          if (fs.existsSync(fullPath)) {
            compilation.fileDependencies.add(fullPath)
          }
        })
      }
    })
  }

  loadAndMergeConfigs (configFilesString) {
    const configPaths = configFilesString.split(',').map(path => path.trim())
    let mergedConfig = {}

    console.log(`Loading and merging config files: ${configPaths.join(', ')}`)

    configPaths.forEach(configPath => {
      try {
        const fullPath = path.resolve(process.cwd(), configPath)

        if (!fs.existsSync(fullPath)) {
          console.warn(`Warning: Config file not found: ${configPath}`)
          return
        }

        const fileContent = fs.readFileSync(fullPath, 'utf8')
        const configData = yaml.load(fileContent)

        if (configData && typeof configData === 'object') {
          // Merge configs - later configs override earlier ones
          mergedConfig = { ...mergedConfig, ...configData }
          console.log(`✓ Loaded config file: ${configPath}`)
        } else {
          console.warn(`Warning: Invalid YAML data in ${configPath}`)
        }
      } catch (error) {
        console.warn(`Warning: Could not load config file ${configPath}:`, error.message)
      }
    })

    console.log(`✓ Merged config available as process.env.${this.envVar}`)
    return mergedConfig
  }
}

module.exports = ConfigMergePlugin
