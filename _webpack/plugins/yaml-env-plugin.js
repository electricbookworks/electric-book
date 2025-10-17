const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

class YamlEnvPlugin {
  constructor (options = {}) {
    // Ensure options is an array for multiple YAML files
    this.yamlFiles = Array.isArray(options) ? options : [options]

    // Validate each yaml file configuration
    this.yamlFiles = this.yamlFiles.map(config => {
      if (typeof config === 'string') {
        // If just a string, assume it's the file path
        return {
          filePath: config,
          envVar: this.generateEnvVarName(config)
        }
      }

      if (!config.filePath) {
        throw new Error('YamlEnvPlugin: filePath is required for each YAML file configuration')
      }

      return {
        filePath: config.filePath,
        envVar: config.envVar || this.generateEnvVarName(config.filePath),
        watch: config.watch !== false // Default to true
      }
    })
  }

  generateEnvVarName (filePath) {
    // Generate environment variable name from file path
    // e.g., "_data/settings.yml" -> "settings"
    // e.g., "_data/nav.yml" -> "nav"
    const fileName = path.basename(filePath, path.extname(filePath))
    return fileName
  }

  apply (compiler) {
    const pluginName = 'YamlEnvPlugin'

    // Load YAML files and add to DefinePlugin before compilation
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const envVars = {}

        for (const yamlConfig of this.yamlFiles) {
          const yamlData = this.loadYamlFile(yamlConfig.filePath)
          envVars[`process.env.${yamlConfig.envVar}`] = yamlData ? JSON.stringify(yamlData) : 'null'
        }

        // Add DefinePlugin with the loaded YAML data
        const definePlugin = new webpack.DefinePlugin(envVars)
        definePlugin.apply(compiler)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Watch for changes in YAML files during development
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      this.yamlFiles.forEach(yamlConfig => {
        if (yamlConfig.watch) {
          const fullPath = path.resolve(process.cwd(), yamlConfig.filePath)
          if (fs.existsSync(fullPath)) {
            compilation.fileDependencies.add(fullPath)
          }
        }
      })
    })
  }

  loadYamlFile (filePath) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath)

      if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: YAML file not found: ${filePath}`)
        return null
      }

      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const yamlData = yaml.load(fileContent)

      console.log(`✓ Loaded YAML file: ${filePath} -> process.env.${this.generateEnvVarName(filePath)}`)
      return yamlData
    } catch (error) {
      console.warn(`Warning: Could not load YAML file ${filePath}:`, error.message)
      return null
    }
  }
}

module.exports = YamlEnvPlugin