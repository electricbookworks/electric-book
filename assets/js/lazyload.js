/* global IntersectionObserver, SVGInject,
    MutationObserver, settings */

// Add observer
const ebImageObserverConfig = {
  rootMargin: '200px' // load image when it's 200px from the viewport
}

// Re-run SVGInject() after lazyloading SVGs
// (Assumes SVGInject() has been bundled already.)
function ebInjectLazyLoadedSVG (image) {
  'use strict'
  if (image.classList.contains('inject-svg') &&
            !image.classList.contains('no-inject-svg') &&
            typeof SVGInject === 'function') {
    SVGInject(image)
  }
}

function ebLazyLoadImages () {
  'use strict'

  // Create an array and then populate it with images.
  let lazyImages = []
  lazyImages = lazyImages.slice
    .call(document.querySelectorAll('[data-src], [data-srcset]'))

  // If IntersectionObserver is supported,
  // and lazyloading is on in settings.yml (loaded in settings.js),
  // create a new one that will use it on all the lazyImages.
  if (Object.prototype.hasOwnProperty.call(window, 'IntersectionObserver')) {
    const lazyImageObserver = new IntersectionObserver(function
    (entries, lazyImageObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target

          // Set the src as the data-src,
          // and the src-set as the data-srcset.
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src
          }
          if (lazyImage.dataset.srcset) {
            lazyImage.srcset = lazyImage.dataset.srcset
          }

          // If the image is an SVG, inject it if necessary
          const fileExtension = lazyImage.src.split('.').pop()
          if (fileExtension === 'svg' || fileExtension === 'SVG') {
            ebInjectLazyLoadedSVG(lazyImage)
          }

          // Stop observing the image once loaded
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    }, ebImageObserverConfig)

    // Observe each image
    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage)
    })
  } else {
    // If the browser doesn't support IntersectionObserver,
    // just change all data-src to src and data-srcset to srcset.
    lazyImages.forEach(function (lazyImage) {
      if (lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src
      }
      if (lazyImage.dataset.srcset) {
        lazyImage.srcset = lazyImage.dataset.srcset
      }
    })
  }
}

// Wait for data-index-targets to be loaded
// and IDs to be assigned before lazyloading.
// Otherwise intersectionObserver can miss images,
// though I don't know why :-(
function ebPrepareForLazyLoading () {
  'use strict'

  const lazyImagesObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes') {
        if (document.body.getAttribute('data-index-targets') &&
                        document.body.getAttribute('data-ids-assigned')) {
          ebLazyLoadImages()
        }
      }
    })
  })

  lazyImagesObserver.observe(document.body, {
    attributes: true // listen for attribute changes
  })
}

// Go when the document is loaded and if lazyLoad enabled
if (settings.web.images.lazyload) {
  ebPrepareForLazyLoading()
}
