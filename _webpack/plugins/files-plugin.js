const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

// Get the ConstDependency class
const ConstDependency = webpack.dependencies.ConstDependency
const pluginName = 'FilesPlugin'

class FilesPlugin {
  constructor (options = {}) {
    this.options = {
      // Environment variable name
      envVar: options.envVar || 'files',
      // Works data directory
      worksDataDir: options.worksDataDir || '_data/works',
      // Excluded styles (matching the Liquid template logic)
      excludedStyles: options.excludedStyles || [
        'cover',
        'previous-publications-page',
        'half-title-page',
        'halftitle-page',
        'title-page',
        'copyright-page',
        'contents-page',
        'epigraph-page',
        'dedication-page'
      ],
      ...options
    }

    // This is the variable key we'll look for in code
    this.envVarKey = `process.env.${this.options.envVar}`

    // This will store the stringified data
    this.definition = '{}' // Default to an empty object
  }

  apply (compiler) {
    // Generate files data and set up DefinePlugin
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const filesData = await this.generateFilesData()

        this.definition = JSON.stringify(filesData || {})

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
          // Replace the expression `process.env.files`
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

    // Watch for changes
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      const worksDataDir = path.resolve(process.cwd(), this.options.worksDataDir)
      if (fs.existsSync(worksDataDir)) {
        compilation.contextDependencies.add(worksDataDir)
      }
      this.getWorkDirectories().forEach(workDir => {
        if (fs.existsSync(workDir)) {
          this.addDirectoryToWatch(compilation, workDir)
        }
      })
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
        } else if (entry.name.endsWith('.md')) {
          compilation.fileDependencies.add(fullPath)
        }
      })
    } catch (err) {
      console.warn(`Warning: Could not watch directory ${dir}:`, err.message)
    }
  }

  getWorkDirectories () {
    const worksDataDir = path.resolve(process.cwd(), this.options.worksDataDir)
    const workDirs = []
    if (!fs.existsSync(worksDataDir)) {
      return workDirs
    }
    try {
      const entries = fs.readdirSync(worksDataDir, { withFileTypes: true })
      entries.forEach(entry => {
        if (entry.isDirectory()) {
          const workDir = path.resolve(process.cwd(), entry.name)
          if (fs.existsSync(workDir)) {
            workDirs.push(workDir)
          }
        }
      })
    } catch (err) {
      console.warn(`Warning: Could not scan works data directory ${worksDataDir}:`, err.message)
    }
    return workDirs
  }

  async generateFilesData () {
    try {
      const filesData = {}
      const worksDataDir = path.resolve(process.cwd(), this.options.worksDataDir)
      if (!fs.existsSync(worksDataDir)) {
        console.warn(`Works data directory not found: ${worksDataDir}`)
        return filesData
      }
      const workEntries = fs.readdirSync(worksDataDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())

      for (const workEntry of workEntries) {
        const workKey = workEntry.name
        const workDir = path.resolve(process.cwd(), workKey)
        if (fs.existsSync(workDir)) {
          filesData[workKey] = await this.scanWorkDirectory(workDir, workKey)
        }
      }
      console.log(`✓ Generated files data for ${Object.keys(filesData).length} works -> ${this.envVarKey}`)
      return filesData
    } catch (error) {
      console.error('Error generating files data:', error)
      throw error
    }
  }

  async scanWorkDirectory (workDir, workKey) {
    const files = []
    try {
      await this.scanDirectoryForMarkdown(workDir, workKey, files)
    } catch (err) {
      console.warn(`Warning: Could not scan work directory ${workDir}:`, err.message)
    }
    return files
  }

  async scanDirectoryForMarkdown (dir, workKey, files) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await this.scanDirectoryForMarkdown(fullPath, workKey, files)
      } else if (entry.name.endsWith('.md')) {
        const fileData = await this.processMarkdownFile(fullPath, workKey)
        if (fileData) {
          files.push(fileData)
        }
      }
    }
  }

  async processMarkdownFile (filePath, workKey) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const filename = path.basename(filePath, '.md')
      const frontmatter = this.extractFrontmatter(content)
      if (frontmatter.style && this.options.excludedStyles.includes(frontmatter.style)) {
        return null
      }
      const relativePath = path.relative(process.cwd(), filePath)
      return {
        file: filename,
        title: frontmatter.title || this.capitalizeFilename(filename),
        style: frontmatter.style || '',
        path: relativePath.replace(/\\/g, '/')
      }
    } catch (err) {
      console.warn(`Warning: Could not process markdown file ${filePath}:`, err.message)
      return null
    }
  }

  extractFrontmatter (content) {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) {
      return {}
    }
    try {
      return yaml.load(frontmatterMatch[1]) || {}
    } catch (err) {
      console.warn('Warning: Could not parse frontmatter YAML:', err.message)
      return {}
    }
  }

  capitalizeFilename (filename) {
    return filename.charAt(0).toUpperCase() + filename.slice(1)
  }
}

module.exports = FilesPlugin
