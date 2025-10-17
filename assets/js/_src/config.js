// TODO: load all configs, then use conditionals to merge, which will be tree-shaken
import defaultConfig from '../../../_config.yml'
let outputConfig = {
  default: {}
}
let buildConfig = {
  default: {}
}
if (process.env.output !== 'print-pdf' && process.env.output !== 'screen-pdf') {
  outputConfig = await import(`../../../_configs/_config.${process.env.output}.yml`)
  if (process.env.build && process.env.build === 'live') {
    buildConfig = await import('../../../_configs/_config.live.yml')
  }
}
const config = { ...defaultConfig, ...outputConfig.default, ...buildConfig.default }
export default config
