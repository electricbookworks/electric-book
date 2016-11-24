 "use strict";

(function () {

  // let Opera Mini use the footer-anchor pattern
  if (navigator.userAgent.indexOf('Opera Mini') === - 1) {

    // let newer browsers use js-powered menu
    if('querySelector' in document &&
       'addEventListener' in window &&
       document.documentElement.classList) {

      // set js nav class
      document.documentElement.classList.add('js-nav');

      // set up the variables
      var menuLink = document.querySelector('[href="#nav"]');
      var menu = document.querySelector('#nav');

      // hide the menu until we click the link
      menu.classList.add("visuallyhidden");

      // show the menu when we click the link
      menuLink.addEventListener("click", function(ev) {
        ev.preventDefault();
        menu.classList.toggle("visuallyhidden");
        document.documentElement.classList.toggle('js-nav-open');
      }, true);

    }

  }

}());
