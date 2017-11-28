"use strict";

var ebwVideoInit = function() {
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
        'querySelector' in document &&
        !!Array.prototype.forEach &&
        'classList' in Element.prototype &&
        'addEventListener' in window &&
        document.querySelectorAll('.video');
}

var ebwVideoHosts = {
    'youtube': 'https://www.youtube.com/embed/',
    'vimeo': 'https://player.vimeo.com/video/',
}

var ebwGetVideoHost = function(videoElement) {
    var videoHost;
    var classes = videoElement.classList;

    classes.forEach(function(currentClass){
        if(ebwVideoHosts.hasOwnProperty(currentClass)) videoHost = currentClass;
    });

    return videoHost;
}

var ebwVideoMakeIframe = function(host, videoId) {
    var hostURL = ebwVideoHosts[host];

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId + '?autoplay=1');

    return iframe;
}

var videoShow = function() {
    // early exit for unsupported browsers
    if (!ebwVideoInit()) return;

    // get all the videos
    var videos = document.querySelectorAll('.video');

    videos.forEach(function(currentVideo){
        // make the iframe
        var videoHost = ebwGetVideoHost(currentVideo);
        var videoId = currentVideo.id;
        var videoWrapper = currentVideo.querySelector('.video-wrapper');
        var iframe = ebwVideoMakeIframe(videoHost, videoId);


        console.log('currentVideo: ' + currentVideo);
        console.log('videoHost: ' + videoHost);
        console.log('currentVideo ID: ' + videoId);

        currentVideo.addEventListener("click", function(ev){
            videoWrapper.classList.add('contains-iframe');
            ev.preventDefault();
            // replace the link with the generated iframe
            videoWrapper.innerHTML = '';
            videoWrapper.appendChild(iframe);
        });
    });
}

videoShow();
