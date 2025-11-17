const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

// Get the ConstDependency class
const ConstDependency = webpack.dependencies.ConstDependency
const pluginName = 'ConfigMergePlugin'

class ConfigMergePlugin {
  constructor (options = {}) {
    this.configFiles = options.configFiles || '_config.yml'
    this.envVar = options.envVar || 'config'
    this.watch = options.watch !== false // Default to true

    // This is the variable key we'll look for in code
    this.envVarKey = `process.env.${this.envVar}`

    // This will store the stringified data
    this.definition = '{}' // Default to an empty object
  }

  apply (compiler) {
    // Load and merge config files before compilation
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const mergedConfig = this.loadAndMergeConfigs(this.configFiles)

        // Override baseurl if provided via command line
        if (process.env.baseurl !== null && process.env.baseurl !== undefined) {
          mergedConfig.baseurl = process.env.baseurl
          console.log(`✓ Overriding baseurl with command-line value: '${process.env.baseurl}'`)
        }

        this.definition = JSON.stringify(mergedConfig)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Hook into the compilation pipeline to replace the variable
    compiler.hooks.compilation.tap(pluginName, (compilation, { normalModuleFactory }) => {
      const handler = (parser) => {
        // Tap into the parser's hook for our specific env var
        parser.hooks.expression.for(this.envVarKey).tap(pluginName, (expr) => {
          // Replace the expression `process.env.config`
          // with the *content* of this.definition.
          const dep = new ConstDependency(this.definition, expr.range)
          dep.loc = expr.loc
          parser.state.current.addDependency(dep)
          return true // Stop parsing this branch
        })
      }

      // Hook into the javascript parser
      normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap(pluginName, handler)
    })

    // Watch for changes (this part was already correct)
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
          mergedConfig = { ...mergedConfig, ...configData }
          console.log(`✓ Loaded config file: ${configPath}`)
        } else {
          console.warn(`Warning: Invalid YAML data in ${configPath}`)
        }
      } catch (error) {
        console.warn(`Warning: Could not load config file ${configPath}:`, error.message)
      }
    })

    console.log(`✓ Merged config available as ${this.envVarKey}`)
    return mergedConfig
  }
}

module.exports = ConfigMergePlugin
