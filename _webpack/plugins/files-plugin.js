const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const webpack = require('webpack')

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
  }

  apply (compiler) {
    const pluginName = 'FilesPlugin'

    // Generate files data and set up DefinePlugin
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const filesData = await this.generateFilesData()

        // Add DefinePlugin with the generated files data
        const definePlugin = new webpack.DefinePlugin({
          [`process.env.${this.options.envVar}`]: JSON.stringify(filesData || {})
        })

        // Apply the DefinePlugin to this compilation
        definePlugin.apply(compiler)

        callback()
      } catch (err) {
        callback(err)
      }
    })

    // Watch for changes in work directories and markdown files during development
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      // Watch the works data directory
      const worksDataDir = path.resolve(process.cwd(), this.options.worksDataDir)
      if (fs.existsSync(worksDataDir)) {
        compilation.contextDependencies.add(worksDataDir)
      }

      // Watch each work directory for markdown files
      this.getWorkDirectories().forEach(workDir => {
        if (fs.existsSync(workDir)) {
          this.addDirectoryToWatch(compilation, workDir)
        }
      })
    })
  }

  addDirectoryToWatch (compilation, dir) {
    // Add the directory to webpack's watch list
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

      // Get all work directories from _data/works
      const workEntries = fs.readdirSync(worksDataDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())

      for (const workEntry of workEntries) {
        const workKey = workEntry.name
        const workDir = path.resolve(process.cwd(), workKey)

        if (fs.existsSync(workDir)) {
          filesData[workKey] = await this.scanWorkDirectory(workDir, workKey)
        }
      }

      console.log(`✓ Generated files data for ${Object.keys(filesData).length} works -> process.env.${this.options.envVar}`)

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
        // Recursively scan subdirectories
        await this.scanDirectoryForMarkdown(fullPath, workKey, files)
      } else if (entry.name.endsWith('.md')) {
        // Process markdown file
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

      // Extract frontmatter
      const frontmatter = this.extractFrontmatter(content)

      // Check if this file should be excluded based on style
      if (frontmatter.style && this.options.excludedStyles.includes(frontmatter.style)) {
        return null
      }

      // Generate relative path from project root
      const relativePath = path.relative(process.cwd(), filePath)

      // Create file object matching the Liquid template structure
      return {
        file: filename,
        title: frontmatter.title || this.capitalizeFilename(filename),
        style: frontmatter.style || '',
        path: relativePath.replace(/\\/g, '/') // Ensure forward slashes for web paths
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
