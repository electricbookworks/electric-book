// Cyphers for each alpha-numeric character
const ebRedactionCypher = {
  a: 'x',
  b: 'x',
  c: 'x',
  d: 'x',
  e: 'x',
  f: ' ',
  g: 'x',
  h: 'x',
  i: ' ',
  j: 'x',
  k: 'x',
  l: ' ',
  m: 'x',
  n: 'x',
  o: 'x',
  p: 'x',
  q: 'x',
  r: 'x',
  s: 'x',
  t: ' ',
  u: 'x',
  v: 'x',
  w: 'x',
  x: 'x',
  y: 'x',
  z: 'x',
  A: 'X',
  B: 'X',
  C: 'X',
  D: 'X',
  E: 'X',
  F: 'X',
  G: 'X',
  H: 'X',
  I: 'X',
  J: 'X',
  K: 'X',
  L: 'X',
  M: 'X',
  N: 'X',
  O: 'X',
  P: 'X',
  Q: 'X',
  R: 'X',
  S: 'X',
  T: 'X',
  U: 'X',
  V: 'X',
  W: 'X',
  X: 'X',
  Y: 'X',
  Z: 'X',
  1: 'I',
  2: 'X',
  3: 'X',
  4: 'X',
  5: 'X',
  6: 'X',
  7: 'X',
  8: 'X',
  9: 'X',
  0: 'X'
}

// Switch a character for its cypher
function ebRedactionCypherSwitch (char) {
  'use strict'
  return ebRedactionCypher[char]
}

// Apply styles to redacted elements
// (Note that Prince doesn't support innerText, hence textContent)
function ebRedactTextStyles (element) {
  'use strict'
  if (element.textContent) {
    console.log('Applying redaction styles...')
    element.style.visibility = 'hidden'
  }
}

// Replace each character with another of a similar width
function ebRedactString (string) {
  'use strict'
  console.log('Anonymising "' + string + '"')
  const newText = string.replace(/([\w\d])/g, function (match) {
    return ebRedactionCypherSwitch(match)
  })
  return newText
}

// Redact images
function ebRedactImages (element) {
  'use strict'

  const arrayOfImages = []

  if (element.tagName === 'IMG') {
    arrayOfImages.push(element)
  } else {
    const imagesInElement = element.querySelectorAll('img')
    imagesInElement.forEach(function (image) {
      arrayOfImages.push(image)
    })
  }

  // Redact each image visually
  arrayOfImages.forEach(function (imageNode) {
    if (imageNode) {
      console.log('Redacting ' + imageNode.src)
      imageNode.style.visibility = 'hidden'
    }
  })
  return element
}

// Redact all the text nodes in an element
function ebRedactTextNodes (element) {
  'use strict'

  // // treeWalker approach, which doesn't work in Prince
  // var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  // while (treeWalker.nextNode()) {
  //     arrayOfTextNodes.push(treeWalker.currentNode);
  // }

  // Slow, Prince-friendly approach
  console.log('Going slow')

  // Thanks https://stackoverflow.com/a/10730777/1781075
  function getTextNodes (node) {
    let textNodes = []
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === 3) {
        textNodes.push(node)
      } else {
        textNodes = textNodes.concat(getTextNodes(node))
      }
    }
    return textNodes
  }

  const arrayOfTextNodes = getTextNodes(element)

  // Anonymise each text node string
  arrayOfTextNodes.forEach(function (textNode) {
    if (textNode.data) {
      textNode.data = ebRedactString(textNode.data)
    }
  })
  return element
}

// Get redaction
function ebRedact () {
  'use strict'
  const elementsToAnonymise = document.querySelectorAll('.redact')
  if (elementsToAnonymise.length > 0) {
    console.log('Redacting...')
    elementsToAnonymise.forEach(function (element) {
      ebRedactTextNodes(element)
      ebRedactImages(element)
      ebRedactTextStyles(element)
    })
  } else {
    console.log('Nothing to redact here.')
  }
}

// Go!
ebRedact()
