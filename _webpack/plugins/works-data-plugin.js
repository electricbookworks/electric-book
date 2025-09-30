const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

class WorksDataPlugin {
  constructor (options = {}) {
    this.options = {
      worksDir: options.worksDir || '_data/works',
      envVar: options.envVar || 'works',
      ...options
    }
  }

  apply (compiler) {
    const pluginName = 'WorksDataPlugin'

    // Generate works data and set up DefinePlugin
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const worksData = await this.generateWorksData()

        // Add DefinePlugin with the generated works data
        const webpack = require('webpack')
        const definePlugin = new webpack.DefinePlugin({
          [`process.env.${this.options.envVar}`]: worksData ? JSON.stringify(worksData) : 'null'
        })

        // Apply the DefinePlugin to this compilation
        definePlugin.apply(compiler)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Watch for changes in the works directory during development
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      const worksDir = path.resolve(process.cwd(), this.options.worksDir)
      if (fs.existsSync(worksDir)) {
        this.addDirectoryToWatch(compilation, worksDir)
      }
    })
  }

  addDirectoryToWatch (compilation, dir) {
    // Add the directory and all its subdirectories to webpack's watch list
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

      console.log(`✓ Generated works data for environment variable: process.env.${this.options.envVar}`)

      // Return the works data for use in DefinePlugin
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

    // First, scan for YAML files directly in the book directory
    const directFiles = fs.readdirSync(bookDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.yml') || dirent.name.endsWith('.yaml')))
      .map(dirent => dirent.name)

    // Load direct YAML files (these are for the default language)
    for (const fileName of directFiles) {
      const filePath = path.join(bookDir, fileName)
      const variantName = path.basename(fileName, path.extname(fileName))

      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const data = yaml.load(content)

        // Store under the default language (or root level)
        if (!bookData.default) {
          bookData.default = {}
        }
        bookData.default[variantName] = data
      } catch (error) {
        console.warn(`Warning: Could not parse ${filePath}:`, error.message)
      }
    }

    // Then scan for language subdirectories
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