const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

// Get the ConstDependency class
const ConstDependency = webpack.dependencies.ConstDependency
const pluginName = 'WorksDataPlugin'

class WorksDataPlugin {
  constructor (options = {}) {
    this.options = {
      worksDir: options.worksDir || '_data/works',
      envVar: options.envVar || 'works',
      ...options
    }

    // This is the variable key we'll look for in code
    this.envVarKey = `process.env.${this.options.envVar}`

    // This will store the stringified data
    this.definition = 'null' // Default to null, as the original code does
  }

  apply (compiler) {
    // Generate works data
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const worksData = await this.generateWorksData()

        this.definition = worksData ? JSON.stringify(worksData) : 'null'

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
          // Replace the expression `process.env.works`
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
      const worksDir = path.resolve(process.cwd(), this.options.worksDir)
      if (fs.existsSync(worksDir)) {
        this.addDirectoryToWatch(compilation, worksDir)
      }
    })
  }

  addDirectoryToWatch (compilation, dir) {
    compilation.contextDependencies.add(dir)
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          this.addDirectoryToWatch(compilation, fullPath)
        } else if (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml')) {
          compilation.fileDependencies.add(fullPath)
        }
      })
    } catch (err) {
      console.warn(`Warning: Could not watch directory ${dir}:`, err.message)
    }
  }

  async generateWorksData () {
    try {
      const worksDir = path.resolve(process.cwd(), this.options.worksDir)
      const works = await this.scanWorksDirectory(worksDir)

      // Use the class property for the log message
      console.log(`✓ Generated works data for environment variable: ${this.envVarKey}`)

      return works
    } catch (error) {
      console.error('Error generating works data:', error)
      throw error
    }
  }

  async scanWorksDirectory (worksDir) {
    const works = {}
    if (!fs.existsSync(worksDir)) {
      console.warn(`Works directory not found: ${worksDir}`)
      return works
    }
    const bookDirs = fs.readdirSync(worksDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const bookName of bookDirs) {
      const bookDir = path.join(worksDir, bookName)
      works[bookName] = await this.scanBookDirectory(bookDir)
    }
    return works
  }

  async scanBookDirectory (bookDir) {
    const bookData = {}
    const directFiles = fs.readdirSync(bookDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.yml') || dirent.name.endsWith('.yaml')))
      .map(dirent => dirent.name)

    for (const fileName of directFiles) {
      const filePath = path.join(bookDir, fileName)
      const variantName = path.basename(fileName, path.extname(fileName))
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const data = yaml.load(content)
        bookData[variantName] = data
      } catch (error) {
        console.warn(`Warning: Could not parse ${filePath}:`, error.message)
      }
    }

    const languageDirs = fs.readdirSync(bookDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const languageCode of languageDirs) {
      const languageDir = path.join(bookDir, languageCode)
      const languageFiles = fs.readdirSync(languageDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.yml') || dirent.name.endsWith('.yaml')))
        .map(dirent => dirent.name)

      if (languageFiles.length > 0) {
        bookData[languageCode] = {}
        for (const fileName of languageFiles) {
          const filePath = path.join(languageDir, fileName)
          const variantName = path.basename(fileName, path.extname(fileName))
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            const data = yaml.load(content)
            bookData[languageCode][variantName] = data
          } catch (error) {
            console.warn(`Warning: Could not parse ${filePath}:`, error.message)
          }
        }
      }
    }
    return bookData
  }
}

module.exports = WorksDataPlugin
