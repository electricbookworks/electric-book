/* jslint browser */
/*globals window, console */

function ebVideoInit() {
    'use strict';
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector &&
            !!Array.prototype.forEach &&
            document.body.classList &&
            document.addEventListener &&
            document.querySelectorAll('.video');
}

var ebVideoHosts = {
    youtube: 'https://www.youtube.com/embed/',
    vimeo: 'https://player.vimeo.com/video/'
};

function ebGetVideoHost(videoElement) {
    'use strict';
    var videoHost;
    var classes = videoElement.classList;

    classes.forEach(function (currentClass) {
        if (ebVideoHosts.hasOwnProperty(currentClass)) {
            videoHost = currentClass;
        }
    });

    return videoHost;
}

function ebVideoSubtitles(videoElement) {
    'use strict';
    var subtitles = videoElement.getAttribute('data-video-subtitles');
    if (subtitles === 'true') {
        subtitles = 1;
        return subtitles;
    }
}

function ebVideoLanguage(videoElement) {
    'use strict';
    var language = videoElement.getAttribute('data-video-language');
    return language;
}

function ebVideoTimestamp(videoElement) {
    'use strict';
    if (videoElement.getAttribute('data-video-timestamp')) {
        var timestamp = videoElement.getAttribute('data-video-timestamp');
        return timestamp;
    }
}

function ebVideoMakeIframe(host, videoId, videoLanguage, videoSubtitles, videoTimestamp) {
    'use strict';

    // Get which video host, e.g. YouTube or Vimeo
    var hostURL = ebVideoHosts[host];

    // Set parameters, starting with autoplay on
    var parametersString = '?autoplay=1';

    // Add a language, if any
    if (videoLanguage) {
        if (host === 'youtube') {
            parametersString += '&cc_lang_pref=' + videoLanguage;
        }
    }

    // Add subtitles, if any
    if (videoSubtitles) {
        if (host === 'youtube') {
            parametersString += '&cc_load_policy=' + videoSubtitles;
        }
    }

    // Add a timestamp, if any
    if (videoTimestamp) {
        if (host === 'youtube') {
            parametersString += '&start=' + videoTimestamp;
        }
        if (host === 'vimeo') {
            parametersString += '#t=' + videoTimestamp;
        }
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId + parametersString);

    return iframe;
}

function ebVideoShow() {
    'use strict';

    // early exit for unsupported browsers
    if (!ebVideoInit()) {
        console.log('Video JS not supported in this browser.');
        return;
    }

    // get all the videos
    var videos = document.querySelectorAll('.video');

    videos.forEach(function (currentVideo) {
        // make the iframe
        var videoHost = ebGetVideoHost(currentVideo);
        var videoId = currentVideo.id;
        var videoLanguage = ebVideoLanguage(currentVideo);
        var videoSubtitles = ebVideoSubtitles(currentVideo);
        var videoTimestamp = ebVideoTimestamp(currentVideo);
        var videoWrapper = currentVideo.querySelector('.video-wrapper');
        var iframe = ebVideoMakeIframe(videoHost, videoId, videoLanguage, videoSubtitles, videoTimestamp);

        // console.log('currentVideo: ' + currentVideo);
        // console.log('videoHost: ' + videoHost);
        // console.log('currentVideo ID: ' + videoId);

        currentVideo.addEventListener("click", function (ev) {
            videoWrapper.classList.add('contains-iframe');
            ev.preventDefault();
            // replace the link with the generated iframe
            videoWrapper.innerHTML = '';
            videoWrapper.appendChild(iframe);
        });
    });
}

ebVideoShow();
