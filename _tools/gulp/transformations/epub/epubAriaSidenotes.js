function epubAriaSidenotes ($) {
  // Add note role to sidenotes
  $('[class^="sidenote"]').each(function () {
    $(this).attr('role', 'note')
  })
}

exports.epubAriaSidenotes = epubAriaSidenotes
