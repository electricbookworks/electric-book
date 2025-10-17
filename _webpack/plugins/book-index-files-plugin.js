const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

class BookIndexFilesPlugin {
  constructor (options = {}) {
    this.options = {
      // Directory to scan for book index files
      searchDir: options.searchDir || 'assets/js/_src',
      // Pattern to match book index files
      filePattern: options.filePattern || /^book-index-.*\.js$/,
      // Environment variable name
      envVar: options.envVar || 'bookIndexFiles',
      ...options
    }
  }

  apply (compiler) {
    const pluginName = 'BookIndexFilesPlugin'

    // Generate book index files data and set up DefinePlugin
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const outputFormats = await this.generateBookIndexFilesData()

        // Add DefinePlugin with the generated book index files data
        const definePlugin = new webpack.DefinePlugin({
          [`process.env.${this.options.envVar}`]: JSON.stringify(outputFormats || [])
        })

        // Apply the DefinePlugin to this compilation
        definePlugin.apply(compiler)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Watch for changes in the search directory during development
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      const searchDir = path.resolve(process.cwd(), this.options.searchDir)
      if (fs.existsSync(searchDir)) {
        compilation.contextDependencies.add(searchDir)

        // Also watch individual files that match our pattern
        try {
          const entries = fs.readdirSync(searchDir, { withFileTypes: true })
          entries.forEach(entry => {
            if (entry.isFile() && this.options.filePattern.test(entry.name)) {
              const fullPath = path.join(searchDir, entry.name)
              compilation.fileDependencies.add(fullPath)
            }
          })
        } catch (err) {
          console.warn(`Warning: Could not watch directory ${searchDir}:`, err.message)
        }
      }
    })
  }

  async generateBookIndexFilesData () {
    try {
      const searchDir = path.resolve(process.cwd(), this.options.searchDir)
      const outputFormats = []

      if (!fs.existsSync(searchDir)) {
        console.warn(`Search directory not found: ${searchDir}`)
        return outputFormats
      }

      const entries = fs.readdirSync(searchDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isFile() && this.options.filePattern.test(entry.name)) {
          // Extract the output format from the filename
          // e.g., "book-index-web.js" -> "web"
          const formatMatch = entry.name.match(/^book-index-(.+)\.js$/)
          if (formatMatch) {
            outputFormats.push(formatMatch[1])
          }
        }
      }

      console.log(`✓ Found book index files for formats: [${outputFormats.join(', ')}] -> process.env.${this.options.envVar}`)

      return outputFormats
    } catch (error) {
      console.error('Error generating book index files data:', error)
      throw error
    }
  }
}

module.exports = BookIndexFilesPlugin