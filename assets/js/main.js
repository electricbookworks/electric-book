/*
Unused imports will be tree-shaken in production mode when using process.env values as execution conditionals.
The process.env values are created by webpack at buildtime - see _webpack/webpack.config.js.
Conditionals using runtime values (e.g. from YAML data imported with yaml-loader) will not be tree-shaken.
*/
import './_src/polyfills'
import ebMarkParents from './_src/mark-parents'
import ebColorPanels from './_src/color-panels'
import ebRedact from './_src/redact'
import ebSetup from './_src/setup'
import ebSearchTerms from './_src/search-terms'
import ebNav from './_src/nav'
import ebVideos from './_src/videos'
import ebMCQs from './_src/mcqs'
import ebSelectList from './_src/select-list'
import ebTables from './_src/tables'
import ebFootnotePopups from './_src/footnote-popups'
import ebSlides from './_src/slides'
import ebShowHide from './_src/show-hide'
import { ebAddCopyButtons } from './_src/copy-to-clipboard'
import ebShare from './_src/share'
import ebExpandableBox from './_src/expandable-box'
import ebSVGManagement from './_src/svg-management'
import ebLazyLoad from './_src/lazyload'
import ebTestingImages from './_src/testing-images'
import ebAnnotation from './_src/annotation'
import ebBookmarks from './_src/bookmarks'
import ebPrinceBoxInfo from './_src/prince-box-info'
import ebHeadingTitles from './_src/heading-titles'
import ebRotate from './_src/rotate'
import ebFootnotes from './_src/footnotes'
import ebShiftElements from './_src/shift-elements'
import ebPageReference from './_src/page-reference'
import ebIndexTargetsInit from './_src/index-targets'
import ebIndexLists from './_src/index-lists'
// import ebBaselineGrid from './src/baseline-grid'

console.log('Config:', process.env.config)
console.log('Settings:', process.env.settings)
// console.log('Works:', process.env.works)
// console.log('Output:', process.env.output)
// console.log('Build:', process.env.build)
// console.log('Files:', process.env.files)

ebMarkParents()
ebColorPanels()

if (process.env.settings.redact === true) {
  ebRedact()
}

if (process.env.output === 'web' || process.env.output === 'app') {
  ebSetup()
  ebSearchTerms()
  ebNav()
  ebVideos()
  ebMCQs()
  ebSelectList()
  ebTables()
  ebFootnotePopups()
  ebSlides()
  ebShowHide()
  ebAddCopyButtons()
  ebShare()
  ebExpandableBox()
  if (process.env.settings.web.svg.inject === true) {
    ebSVGManagement()
  }
  ebLazyLoad()
}

ebTestingImages()

const webDevAnnotation = process.env.output === 'web' && process.env.build !== 'live' && process.env.settings.web.annotator.development === true
const webLiveAnnotation = process.env.output === 'web' && process.env.build === 'live' && process.env.settings.web.annotator.live === true
if (webDevAnnotation || webLiveAnnotation) {
  ebAnnotation()
}

/*
Enable bookmarks in _data settings.yml, and define options in assets/bookmarks.js.
This lets us have different behaviour for web or app.
*/
const webBookmarks = process.env.output === 'web' && process.env.settings.web.bookmarks.enabled === true
const appBookmarks = process.env.output === 'app' && process.env.settings.app.bookmarks.enabled === true
if (webBookmarks || appBookmarks) {
  ebBookmarks()
}

if (process.env.output === 'screen-pdf' || process.env.output === 'print-pdf') {
  // Load Prince-specific utilities.
  ebPrinceBoxInfo()

  /*
    This script gives every heading a title attribute.
    This is useful to Prince, which can use title attributes for running heads.
    By default, we only load it for PDF outputs.
    */
  ebHeadingTitles()

  // This script helps rotate large figures on the page.
  ebRotate()

  // This script moves endnotes to the bottoms of pages.
  ebFootnotes()

  // This script shifts elements in the DOM.
  ebShiftElements()

  /*
    This script detects the page number we are on and provides
    the relevant page cross-reference text as generated content.
    */
  ebPageReference()

  /*
    This aligns elements to a baseline grid.
    This is experimental, so it's commented out by default.
    */
  // ebBaselineGrid()
}

// Tools for generating and displaying book indexes
if (process.env.settings['dynamic-indexing'] !== false) {
  /*
  Script to turn HTML comments into anchor targets.
  Also handled by gulp in PDF, epub; but included
  in all outputs so that Puppeteer can index.
  */
  ebIndexTargetsInit()

  /*
  Script that adds index-reference links.
  This is done client-side in web and app, and pre-processed by gulp
  in PDF and epub outputs.
  */
  if (process.env.output === 'web' || process.env.output === 'app') {
    ebIndexLists()
  }
}

// Scripts for epub output. Do not expect support in many readers.
if (process.env.output === 'epub') {
  ebMCQs()
  ebShowHide()
}
