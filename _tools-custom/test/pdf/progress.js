// TTY-aware progress reporter for long-running steps like rendering pages and
// comparing them. On an interactive terminal it rewrites a single line so the
// count updates in place; when output is redirected (CI, a log file) it prints
// an occasional line instead, so the logs don't fill up with hundreds of
// updates.

const isTty = Boolean(process.stdout.isTTY)

// Create a reporter for a labelled task with a known total. Call update(done)
// as work proceeds; it finalises itself (a newline) once done reaches total.
function start (label, total) {
  let loggedStep = -1

  return {
    update: function (done) {
      if (isTty) {
        // Trailing spaces clear any leftover digits from a longer previous line.
        process.stdout.write('\r  ' + label + ': ' + done + '/' + total + '   ')
        if (done >= total) {
          process.stdout.write('\n')
        }
        return
      }

      // Non-interactive: log at most every 25%, plus the final count.
      const step = total > 0 ? Math.floor((done / total) * 4) : 4
      if (step !== loggedStep || done >= total) {
        loggedStep = step
        console.log('  ' + label + ': ' + done + '/' + total)
      }
    }
  }
}

// Return an onProgress(done, total) callback that lazily creates a reporter on
// the first call (when the total is known) and updates it thereafter.
function reporter (label) {
  let bar = null
  return function (done, total) {
    if (!bar) {
      bar = start(label, total)
    }
    bar.update(done)
  }
}

module.exports = { start, reporter }
