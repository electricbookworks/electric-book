// Conditionally import marked only when not building for PDF
// because marked is not compatible with PrinceXML.
let marked = null
if (process.env.output !== 'print-pdf' && process.env.output !== 'screen-pdf') {
  marked = (await import('marked')).marked
}
export default marked
