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

      // add a close button
      var closeButton = '<button data-toggle data-nav-close><span class="visuallyhidden">Close menu</span></button>';
      menu.insertAdjacentHTML('afterBegin', closeButton);
      var closeButtonInDOM = document.querySelector('[data-nav-close]');

      // hide the children and add the button for toggling
      var subMenus = document.querySelectorAll('#nav .has-children, #nav .has-children');
      var showChildrenButton = '<button data-toggle data-toggle-nav><span class="visuallyhidden">Toggle children</span></button>';
      for (var i = 0; i < subMenus.length; i++) {
        subMenus[i].querySelector('ol, ul').classList.add('visuallyhidden');
        subMenus[i].querySelector('a').insertAdjacentHTML('afterend', showChildrenButton);
      }

      // show the menu when we click the link
      menuLink.addEventListener("click", function(ev) {
        ev.preventDefault();
        menu.classList.toggle("visuallyhidden");
        document.documentElement.classList.toggle('js-nav-open');
      }, true);

      var hideMenu = function() {
          menu.classList.add("visuallyhidden");
          document.documentElement.classList.remove('js-nav-open');
      }

      // listen for clicks inside the menu
      menu.addEventListener("click", function(ev) {
        if (ev.srcElement.parentNode.classList.contains("active")
            && ev.srcElement.tagName === "A") {
            // if it's an on-page anchor, hide the menu
            hideMenu();
        } else if (ev.srcElement.hasAttribute("data-nav-close")) {
            // hide the menu when we click the button
            ev.preventDefault();
            hideMenu();
        } else  if (ev.srcElement.hasAttribute("data-toggle-nav")) {
            // show the children when we click a .has-children
            ev.preventDefault();
            ev.srcElement.classList.toggle('show-children');
            ev.srcElement.nextElementSibling.classList.toggle('visuallyhidden');
        }

        });

    }

  }

}());
