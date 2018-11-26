/* jslint browser */
/*globals window */

function ebwVideoInit() {
    'use strict';
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector &&
            !!Array.prototype.forEach &&
            document.body.classList &&
            document.addEventListener &&
            document.querySelectorAll('.video');
}

var ebwVideoHosts = {
    youtube: 'https://www.youtube.com/embed/',
    vimeo: 'https://player.vimeo.com/video/'
};

function ebwGetVideoHost(videoElement) {
    'use strict';
    var videoHost;
    var classes = videoElement.classList;

    classes.forEach(function (currentClass) {
        if (ebwVideoHosts.hasOwnProperty(currentClass)) {
            videoHost = currentClass;
        }
    });

    return videoHost;
}

function ebwVideoMakeIframe(host, videoId) {
    'use strict';
    var hostURL = ebwVideoHosts[host];

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId + '?autoplay=1');

    return iframe;
}

function videoShow() {
    'use strict';

    // early exit for unsupported browsers
    if (!ebwVideoInit()) {
        console.log('Video JS not supported in this browser.');
        return;
    }

    // get all the videos
    var videos = document.querySelectorAll('.video');

    videos.forEach(function (currentVideo) {
        // make the iframe
        var videoHost = ebwGetVideoHost(currentVideo);
        var videoId = currentVideo.id;
        var videoWrapper = currentVideo.querySelector('.video-wrapper');
        var iframe = ebwVideoMakeIframe(videoHost, videoId);


        console.log('currentVideo: ' + currentVideo);
        console.log('videoHost: ' + videoHost);
        console.log('currentVideo ID: ' + videoId);

        currentVideo.addEventListener("click", function (ev) {
            videoWrapper.classList.add('contains-iframe');
            ev.preventDefault();
            // replace the link with the generated iframe
            videoWrapper.innerHTML = '';
            videoWrapper.appendChild(iframe);
        });
    });
}

videoShow();
