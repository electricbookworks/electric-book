const fs = require('fs-extra')
const fsPath = require('path')
const qrCode = require('qrcode')
const { book, language, format } = require('../../helpers/args.js')

// Generate QR code images
function qrCodes ($) {
  // Create path to save images to
  let imageLocation = process.cwd() + '/_site/' +
      book + '/'
  if (language) {
    imageLocation += language + '/'
  }
  imageLocation += 'images/' + format + '/'
  imageLocation = fsPath.normalize(imageLocation)

  // Ensure that path exists
  if (!fs.existsSync(imageLocation)) {
    fs.mkdirSync(imageLocation)
  }

  // Generate code images
  $('[class^="qr-code"]').each(function () {
    const filename = $(this).attr('data-qr-filename')
    const data = $(this).attr('data-qr-content')

    if (filename && data) {
      qrCode.toFile(imageLocation + filename, data, {
        margin: '0',
        type: 'png'
      }, function (err) {
        if (err) throw err
        console.log('Generated QR code ' + filename + ' for ' + data)
      })
    }
  })
}

exports.qrCodes = qrCodes
