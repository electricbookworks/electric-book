// Lint with JS Standard

// Import Node modules
const projectSettings = require('./projectSettings.js')

// Get variant settings
function variantSettings (argv) {
  let format = 'web' // fallback
  if (argv && argv.format) {
    format = argv.format
  }
  // Create an object for default settings
  const settings = {
    active: false,
    stylesheet: format + '.css'
  }

  // Check the project settings for an active variant.
  if (projectSettings() &&
      projectSettings()['active-variant'] &&
      projectSettings()['active-variant'] !== '') {
    settings.active = projectSettings()['active-variant']
  }

  // Check for the variant-specific stylesheet we should use.
  if (settings.active && projectSettings().variants) {
    // Loop through the variants in project settings
    // to find the active variant. Then return
    // the format-specific stylesheet name there.
    projectSettings().variants.forEach(function (variantEntry) {
      if (variantEntry.variant === projectSettings()['active-variant'] &&
          variantEntry[argv.format + '-stylesheet'] &&
          variantEntry[argv.format + '-stylesheet'] !== '') {
        settings.stylesheet = variantEntry[argv.format + '-stylesheet']
      }
    })
  }

  return settings
}

module.exports = variantSettings
