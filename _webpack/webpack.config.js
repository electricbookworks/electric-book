const path = require('path')
const webpack = require('webpack')
const yargs = require('yargs')
const WorksDataPlugin = require('./plugins/works-data-plugin')
const YamlEnvPlugin = require('./plugins/yaml-env-plugin')
const BookIndexFilesPlugin = require('./plugins/book-index-files-plugin')
const FilesPlugin = require('./plugins/files-plugin')
const ConfigMergePlugin = require('./plugins/config-merge-plugin')
const mode = yargs.argv.mode || 'development'
const ebBuild = process.env.build || 'development'
const isWebAppOutput = process.env.output === 'web' || process.env.output === 'app'
const isPrinceOutput = process.env.output === 'print-pdf' || process.env.output === 'screen-pdf'

module.exports = {
  mode,
  entry: {
    main: path.resolve(process.cwd(), 'assets/js/main.js'),
    ...(isWebAppOutput && {
      search: path.resolve(process.cwd(), 'assets/js/search.js')
    })
  },
  target: isPrinceOutput ? ['web', 'es5'] : 'web',
  output: {
    filename: '[name].dist.js',
    chunkFilename: (pathData) => {
      // Remove leading underscores from chunk names to avoid Jekyll ignoring them
      const name = pathData.chunk.name || pathData.chunk.id || 'chunk'
      const cleanName = String(name).replace(/^_+/, '')
      return `${cleanName}.main.dist.js`
    },
    path: path.resolve(process.cwd(), 'assets/js/dist'),
    clean: {
      keep: '.gitignore'
    },
    ...(isPrinceOutput && {
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false
      }
    })
  },
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  module: {
    rules: [
      {
        test: /\.yml$/,
        use: 'yaml-loader'
      },
      ...(isPrinceOutput
        ? [{
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    modules: false,
                    forceAllTransforms: true,
                    loose: false
                  }]
                ]
              }
            }
          }]
        : [])
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(process.cwd(), 'assets/js')
    }
  },
  plugins: [
    new ConfigMergePlugin({
      configFiles: process.env.configFiles || '_config.yml',
      envVar: 'config'
    }),
    new WorksDataPlugin({
      worksDir: '_data/works',
      envVar: 'works'
    }),
    new YamlEnvPlugin([
      {
        filePath: '_data/settings.yml',
        envVar: 'settings'
      },
      {
        filePath: '_data/locales.yml',
        envVar: 'locales'
      }
    ]),
    new BookIndexFilesPlugin({
      searchDir: 'assets/js/_src',
      envVar: 'bookIndexFiles'
    }),
    new FilesPlugin({
      envVar: 'files'
    }),
    new webpack.DefinePlugin({
      'process.env.output': JSON.stringify(process.env.output || 'web'),
      'process.env.build': JSON.stringify(ebBuild)
    })
  ],
  devtool: process.env.debug === 'true' ? 'eval-source-map' : false,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
}
