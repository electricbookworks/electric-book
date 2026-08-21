// Page-count regression check. A change in page count almost always
// means text has reflowed, so it is always treated as a failure.
// Follows the standard test-module contract: { name, run(context) }.

module.exports = {
  name: 'Page count',

  run: async function (context) {
    const canonicalCount = context.rendered.canonical.pages.length
    const currentCount = context.rendered.current.pages.length
    const expected = context.entry && typeof context.entry.pages === 'number'
      ? context.entry.pages
      : canonicalCount

    const passed = currentCount === expected
    const message = passed
      ? 'Page count unchanged (' + currentCount + ')'
      : 'Page count changed: expected ' + expected + ', got ' + currentCount

    return {
      passed,
      summary: currentCount + ' pages',
      results: [{ passed, message }]
    }
  }
}
