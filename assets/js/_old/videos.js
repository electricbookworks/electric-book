/* global IntersectionObserver */

function ebVideoInit () {
  'use strict'
  return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector &&
            !!Array.prototype.forEach &&
            document.body.classList &&
            document.addEventListener &&
            document.querySelectorAll('.video')
}

const ebVideoHosts = {
  youtube: 'https://www.youtube.com/embed/',
  vimeo: 'https://player.vimeo.com/video/'
}

function ebGetVideoHost (videoElement) {
  'use strict'
  let videoHost
  const classes = videoElement.classList

  classes.forEach(function (currentClass) {
    if (Object.prototype.hasOwnProperty.call(ebVideoHosts, currentClass)) {
      videoHost = currentClass
    }
  })

  return videoHost
}

function ebVideoSubtitles (videoElement) {
  'use strict'
  let subtitles = videoElement.getAttribute('data-video-subtitles')
  if (subtitles === 'true') {
    subtitles = 1
    return subtitles
  }
}

function ebVideoLanguage (videoElement) {
  'use strict'
  const language = videoElement.getAttribute('data-video-language')
  return language
}

function ebVideoTimestamp (videoElement) {
  'use strict'
  if (videoElement.getAttribute('data-video-timestamp')) {
    const timestamp = videoElement.getAttribute('data-video-timestamp')
    return timestamp
  }
}

function ebVideoMakeIframe (host, videoId, videoLanguage, videoSubtitles, videoTimestamp) {
  'use strict'

  // Get which video host, e.g. YouTube or Vimeo
  const hostURL = ebVideoHosts[host]

  // Set parameters, starting with autoplay on
  let parametersString = '?autoplay=1'

  // Add a language, if any
  if (videoLanguage) {
    if (host === 'youtube') {
      parametersString += '&cc_lang_pref=' + videoLanguage
    }
  }

  // Add subtitles, if any
  if (videoSubtitles) {
    if (host === 'youtube') {
      parametersString += '&cc_load_policy=' + videoSubtitles
    }
  }

  // Add a timestamp, if any
  if (videoTimestamp) {
    if (host === 'youtube') {
      parametersString += '&start=' + videoTimestamp
    }
    if (host === 'vimeo') {
      parametersString += '#t=' + videoTimestamp
    }
  }

  const iframe = document.createElement('iframe')
  iframe.setAttribute('frameborder', 0)
  iframe.setAttribute('allowfullscreen', '')
  iframe.setAttribute('src', hostURL + videoId + parametersString)

  return iframe
}

// Only show video options on button click
function videoOptionsDropdown (video) {
  'use strict'

  const videoOptions = video.querySelector('.video-options')
  if (videoOptions) {
    const button = videoOptions.querySelector('button')
    const options = videoOptions.querySelector('.video-options-content')

    // Unless this listener has already been added,
    // listen for clicks on the video-options button.
    if (!options.classList.contains('js-video-options-content')) {
      options.classList.add('js-video-options-content')
      button.addEventListener('click', function (event) {
        options.classList.toggle('js-video-options-content-visible')
      })
    }
  }
}

function ebVideoShow (video) {
  'use strict'

  // early exit for unsupported browsers
  if (!ebVideoInit()) {
    console.log('Video JS not supported in this browser.')
    return
  }

  // Create the list of videos, either from the supplied video
  // or from all the videos on the page.
  let videos = []
  if (video) {
    videos.push(video)
  } else {
    videos = document.querySelectorAll('.video')
  }

  videos.forEach(function (currentVideo) {
    // make the iframe
    const videoHost = ebGetVideoHost(currentVideo)
    const videoId = currentVideo.id
    const videoLanguage = ebVideoLanguage(currentVideo)
    const videoSubtitles = ebVideoSubtitles(currentVideo)
    const videoTimestamp = ebVideoTimestamp(currentVideo)
    const videoWrapper = currentVideo.querySelector('.video-wrapper')
    const iframe = ebVideoMakeIframe(videoHost, videoId, videoLanguage, videoSubtitles, videoTimestamp)

    // console.log('currentVideo: ' + currentVideo);
    // console.log('videoHost: ' + videoHost);
    // console.log('currentVideo ID: ' + videoId);
    // console.log('videoLanguage: ' + videoLanguage);
    // console.log('videoSubtitles: ' + videoSubtitles);
    // console.log('videoTimestamp: ' + videoTimestamp);
    // console.log('iframe:');
    // console.log(iframe);

    videoWrapper.addEventListener('click', function (ev) {
      videoWrapper.classList.add('contains-iframe')
      ev.preventDefault()
      // replace the link with the generated iframe
      videoWrapper.innerHTML = ''
      videoWrapper.appendChild(iframe)
    }, { once: true })

    // Scriptify the options dropdown
    videoOptionsDropdown(currentVideo)
  })
}

// Sometimes the accordion script won't trigger ebVideoShow,
// so we listen for the video on the page as a fallback.
function ebVideoWatch () {
  'use strict'

  // console.log('Watching for videos...');

  // Create an array and then populate it with images.
  let videos = []
  videos = document.querySelectorAll('.video')

  // If IntersectionObserver is supported,
  // create a new one that will use it on all the videos.
  if (Object.prototype.hasOwnProperty.call(window, 'IntersectionObserver')) {
    const ebVideoObserverConfig = {
      rootMargin: '200px' // load when it's 200px from the viewport
    }

    const videoObserver = new IntersectionObserver(function
    (entries, videoObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // console.log('Found video:');
          // console.log(entry.target);

          const video = entry.target

          // Show the video iframe
          ebVideoShow(video)

          // Stop observing the image once loaded
          videoObserver.unobserve(video)
        }
      })
    }, ebVideoObserverConfig)

    // Observe each image
    videos.forEach(function (video) {
      videoObserver.observe(video)
    })
  } else {
    // If the browser doesn't support IntersectionObserver,
    // just load all the videos.
    videos.forEach(function (video) {
      ebVideoShow(video)
    })
  }
}

ebVideoShow()
ebVideoWatch()
