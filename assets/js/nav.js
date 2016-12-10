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

      // hide the children and add the button for toggling
      var subMenus = document.querySelectorAll('#nav .has-children, #nav .has-children');
      var showChildrenButton = '<button data-toggle-nav><span class="visuallyhidden">Toggle children</button>';
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

      // show the children when we click a .has-children
      menu.addEventListener("click", function(ev) {
        if (ev.target.hasAttribute("data-toggle-nav")) {
          ev.preventDefault();
          ev.target.classList.toggle('show-children');
          ev.target.nextElementSibling.classList.toggle('visuallyhidden');
        }
      }, true)

    }

  }

}());
