/* globals ebClosestAncestor, ebCheckForPage, ebPrepareForLazyLoading, settings */

// This script is mainly for projects that use remote media.
// It replaces images on a page with any with the same name
// at the remote-images > testing URL in settings.yml. Process:
// 1. Find all the images on the page.
// 2. For each image, if it's external, i.e. served over HTTP,
//    check if the same filename exists at the testing URL.
// 3. If it does, replace the src URL with the testing version.
// 4. Re-run SVGInject and lazyload with the new URL(s).

function ebLoadTestingImages () {
  const images = document.querySelectorAll('img[data-src], img[src]')

  // Check if we're using remote media
  let remoteMediaMode = false
  if (settings.remoteMedia.development && settings.remoteMedia.development.length > 0) {
    remoteMediaMode = true
  }

  // Check whether there is a testing URL in settings
  let testingMode = false
  if (settings.remoteMedia.testing && settings.remoteMedia.testing.length > 0) {
    testingMode = true
  }

  let imageCounter = 0

  // If there are images on the page, and there is
  // a testing URL defined in settings ...
  if (images && testingMode) {
    // Get the relevant src for each image
    images.forEach(function (image) {
      let imageSrc
      if (image.dataset && image.dataset.src) {
        imageSrc = image.dataset.src
      } else {
        imageSrc = image.src
      }

      // If this image has a src, figure out
      // what its testing equivalent would be.
      if (imageSrc) {
        let imageAtTestingURL
        if (remoteMediaMode) {
          // is remote
          imageAtTestingURL = imageSrc.replace(settings.remoteMedia.development, settings.remoteMedia.testing)
        } else {
          const bookFolder = document.querySelector('.wrapper').getAttribute('data-book-directory')
          imageAtTestingURL = settings.remoteMedia.testing + '/' + bookFolder + '/' + imageSrc
        }

        const originalImageFolderPath = imageSrc.substring(0, imageSrc.lastIndexOf('/'))
        const testingImageFolderPath = imageAtTestingURL.substring(0, imageAtTestingURL.lastIndexOf('/'))

        // If there is an image at that testing URL,
        // replace the image's src attribute(s)
        // with that testing URL.
        if (ebCheckForPage(imageAtTestingURL)) {
          console.log('Using testing version of ' + imageSrc + ' from ' + imageAtTestingURL)

          if (image.dataset && image.dataset.src) {
            image.setAttribute('data-src', imageAtTestingURL)
          } else {
            image.setAttribute('src', imageAtTestingURL)
          }

          if (image.dataset && image.dataset.srcset) {
            // Note: Prince does not support replaceAll,
            // but PDF HTML does not use srcset.
            image.dataset.srcset = image.dataset.srcset.replaceAll(originalImageFolderPath, testingImageFolderPath)
          }
        }
      }

      // If we're done, reload any lazyload images,
      // if this is web or app output.
      // Flag that we're done so that other steps
      // like ebInjectSVGs() can safely run.
      imageCounter += 1
      if (images.length === imageCounter) {
        if (settings.site.output === 'web' || settings.site.output === 'app') {
          ebPrepareForLazyLoading()
        }
        document.body.setAttribute('data-testing-images', 'loaded')
      }
    })
  } else {
    document.body.setAttribute('data-testing-images', 'none')
  }
}

ebLoadTestingImages()
