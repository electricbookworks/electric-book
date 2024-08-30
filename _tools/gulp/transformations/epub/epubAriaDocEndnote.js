// Kramdown adds the ARIA role doc-endnote, but this role
// is deprecated. Remove it to avoid EPUBCheck warnings.
function epubAriaDocEndnote ($) {
  $('[role="doc-endnote"]').each(function () {
    $(this).removeAttr('role')
  })
}

exports.epubAriaDocEndnote = epubAriaDocEndnote
