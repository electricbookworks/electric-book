const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

// Get the ConstDependency class for variable replacement
const ConstDependency = webpack.dependencies.ConstDependency
const pluginName = 'YamlEnvPlugin'

class YamlEnvPlugin {
  constructor (options = {}) {
    // Ensure options is an array for multiple YAML files
    this.yamlFiles = Array.isArray(options) ? options : [options]

    // Validate each yaml file configuration
    this.yamlFiles = this.yamlFiles.map(config => {
      if (typeof config === 'string') {
        return {
          filePath: config,
          envVar: this.generateEnvVarName(config),
          watch: true
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

    this.definitions = {}
  }

  generateEnvVarName (filePath) {
    const fileName = path.basename(filePath, path.extname(filePath))
    return fileName
  }

  loadYamlFile (filePath, envVar) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath)
      if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: YAML file not found: ${filePath}`)
        return null
      }
      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const yamlData = yaml.load(fileContent)
      console.log(`✓ Loaded YAML file: ${filePath} -> process.env.${envVar}`)
      return yamlData
    } catch (error) {
      console.warn(`Warning: Could not load YAML file ${filePath}:`, error.message)
      return null
    }
  }

  apply (compiler) {
    // Hook into beforeCompile to reload data on every build
    compiler.hooks.beforeCompile.tapAsync(pluginName, (params, callback) => {
      try {
        // Clear old definitions and reload
        this.definitions = {}
        for (const yamlConfig of this.yamlFiles) {
          const yamlData = this.loadYamlFile(yamlConfig.filePath, yamlConfig.envVar)
          // Store the *stringified* version, just like DefinePlugin
          this.definitions[`process.env.${yamlConfig.envVar}`] = yamlData ? JSON.stringify(yamlData) : 'null'
        }
        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Hook into the compilation pipeline to replace the variables
    compiler.hooks.compilation.tap(pluginName, (compilation, { normalModuleFactory }) => {
      const handler = (parser) => {
        // For each definition (e.g., 'process.env.settings')
        // tap into the parser's hook for that expression
        for (const key of Object.keys(this.definitions)) {
          parser.hooks.expression.for(key).tap(pluginName, (expr) => {
            // This is what DefinePlugin does internally:
            // It adds a "ConstDependency" to replace the code `process.env.settings`
            // with the *stringified content* from `this.definitions[key]`.
            // Because this.definitions is updated in `beforeCompile`,
            // this will always use the latest data.
            const dep = new ConstDependency(this.definitions[key], expr.range)
            dep.loc = expr.loc
            parser.state.current.addDependency(dep)
            // Stop parsing this expression branch
            return true
          })
        }
      }

      // Hook into the javascript parser
      normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap(pluginName, handler)
    })

    // Watch for changes in YAML files
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
}

module.exports = YamlEnvPlugin
