/* global Prince, BoxInfo */

// Adapted from
// https://www.princexml.com/doc/cookbook/#how-and-where-is-my-box

if (typeof Prince !== 'undefined') {
  // Activate box-tracking
  Prince.trackBoxes = true

  addBoxInfoMethods()
}

function Box (x, y, w, h, u) {
  let d = 1

  if (u === 'cm') {
    d = 72 / 2.54
  } else if (u === 'in') {
    d = 72
  } else if (u === 'mm') {
    d = 72 / 25.4
  } else if (u === 'q') {
    d = 72 / 101.6
  } else if (u === 'pc') {
    d = 1 / 12
  } else if (u === 'pt') {
    d = 1
  } else if (u === 'px') {
    d = 72 / 96
  } else {
    console.log('Box: unknown units: ' + u)
  }

  this.x = x / d
  this.y = y / d
  this.w = w / d
  this.h = h / d
}

function addBoxInfoMethods () {
  BoxInfo.prototype.marginBox = function (u) {
    const x = this.x - this.marginLeft
    const y = this.y + this.marginTop
    const w = this.w + this.marginLeft + this.marginRight
    const h = this.h + this.marginTop + this.marginBottom
    return new Box(x, y, w, h, u)
  }

  BoxInfo.prototype.borderBox = function (u) {
    const x = this.x
    const y = this.y
    const w = this.w
    const h = this.h
    return new Box(x, y, w, h, u)
  }

  BoxInfo.prototype.paddingBox = function (u) {
    const bTop = parseFloat(this.style.borderTopWidth.slice(0, -2))
    const bRight = parseFloat(this.style.borderRightWidth.slice(0, -2))
    const bBottom = parseFloat(this.style.borderBottomWidth.slice(0, -2))
    const bLeft = parseFloat(this.style.borderLeftWidth.slice(0, -2))
    const x = this.x + bLeft
    const y = this.y - bTop
    const w = this.w - bLeft - bRight
    const h = this.h - bTop - bBottom
    return new Box(x, y, w, h, u)
  }

  BoxInfo.prototype.contentBox = function (u) {
    const bTop = parseFloat(this.style.borderTopWidth.slice(0, -2))
    const bRight = parseFloat(this.style.borderRightWidth.slice(0, -2))
    const bBottom = parseFloat(this.style.borderBottomWidth.slice(0, -2))
    const bLeft = parseFloat(this.style.borderLeftWidth.slice(0, -2))
    const pTop = parseFloat(this.style.paddingTop.slice(0, -2))
    const pRight = parseFloat(this.style.paddingRight.slice(0, -2))
    const pBottom = parseFloat(this.style.paddingBottom.slice(0, -2))
    const pLeft = parseFloat(this.style.paddingLeft.slice(0, -2))
    const x = this.x + bLeft + pLeft
    const y = this.y - bTop - pTop
    const w = this.w - bLeft - bRight - pLeft - pRight
    const h = this.h - bTop - bBottom - pTop - pBottom
    return new Box(x, y, w, h, u)
  }
}
