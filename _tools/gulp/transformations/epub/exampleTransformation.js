// For methods you can use to manipulate $(this), see
// https://cheerio.js.org/docs/api/classes/Cheerio#manipulation-methods

function exampleTransformation ($) {
  $('[class^="figure"]').each(function () {
    // console.log($(this) + ' is a figure.')
  })
}

exports.exampleTransformation = exampleTransformation
