/* globals ebCheckForPage, ebInjectSVGs, ebPrepareForLazyLoading, settings */

// This script runs on development sites, not live sites.
// It is intended for use on projects that use remote media.
// It replaces images with any alternatives that are available
// at the remote-images > testing URL in settings.yml. Process:
// 1. Find all the images on the page.
// 2. For each image, if it's external, i.e. served over HTTP,
//    check if the same filename exists at the testing URL.
// 3. If it does, replace the src URL with the testing version.
// 4. Re-run SVGInject and lazyload with the new URL(s).

function ebLoadTestingImages () {
  const images = document.querySelectorAll('img[data-src], img[src]')
  const devImages = settings.remoteMedia.development
  const testImages = settings.remoteMedia.testing
  let imageCounter = 0

  if (images) {
    images.forEach(function (image) {
      let imageSrc
      if (image.dataset && image.dataset.src) {
        imageSrc = image.dataset.src
      } else {
        imageSrc = image.src
      }

      // If this image has a src and it's not local,
      // replace its URL with the testing equivalent
      // if the image seems to exist at that URL.
      if (imageSrc && imageSrc.match(/^http/)) {
        const imageAtTestingURL = imageSrc.replace(devImages, testImages)
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
            image.dataset.srcset = image.dataset.srcset.replaceAll(devImages, testImages)
          }
        }
      }

      // If we're done, re-inject SVGs
      // and reload any lazyload images,
      // if this is web or app output.
      imageCounter += 1
      if (images.length === imageCounter) {
        if (settings.site.output === 'web' || settings.site.output === 'app') {
          ebPrepareForLazyLoading()
          ebInjectSVGs()
        }
      }
    })
  }
}

ebLoadTestingImages()
