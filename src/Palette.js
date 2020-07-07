const assign = require('simple-assign')

module.exports = Palette

// A JASC Paint Shop Pro Palette file.
//
// Usage:
// Palette(buf) where `buf` is a palette file source string or Buffer
// let pal = Palette(fs.readFileSync('palette.pal')) → a palette array parsed from source
// let pal = Palette([ [ r0, g0, b0 ], [ r1, g1, b1 ] ]) → a new palette array
// pal[0], pal.getColor(0) → the colour at the given index
// pal[0] = [ r, g, b ], pal.setColor(0, [ r, g, b ]) → set colour at an index
// pal.toString() → new palette file source string
//
// Palette file format (.pal):
// ```
// "JASC-PAL"
// 4 character version
// amount of lines
// fixed alpha (optional)
// # comments start with hash
// palette lines: three space-separated numbers (0-255), "<red> <green> <blue>"
//           *OR* four  space-separated numbers (0-255), "<red> <green> <blue> <something>"
// ```
function Palette (buf) {
  if (!(this instanceof Palette)) return new Palette(buf)

  if (!buf) buf = []

  let data
  if (Array.isArray(buf)) {
    // creating a new palette
    data = { colors: buf, numColors: buf.length, version: '0100' }
  } else {
    // reading a palette
    const str = Buffer.isBuffer(buf) ? buf.toString('ascii') : buf
    data = parse(str)
  }

  // internal API
  assign(this, data)
  // public API
  data.colors.version = data.version
  Object.keys(Palette.prototype).forEach((key) => {
    data.colors[key] = this[key].bind(this)
  })

  return data.colors
}

function parse (buf) {
  const colors = []

  const lines = buf.split(/\r?\n/)

  // lines[0] == "JASC-PAL"
  const format = lines[0]
  const version = lines[1] // probably always 0100
  const numColors = parseInt(lines[2], 10)

  let entriesStart = 3
  let fixedAlpha = null
  if (lines[3].startsWith('$')) {
    // lines[3] == $ALPHA (0-255)
    fixedAlpha = parseInt(lines[3].split(' ')[1], 10)
    entriesStart = 4
  }

  // TODO also check whether the file is valid
  for (let i = entriesStart; i < lines.length; i++) {
    if (!lines[i] || lines[i].startsWith('#')) {
      // Comments or empty lines
      continue
    }

    colors.push(lines[i].split(/\s+/).map(x => parseInt(x, 10)))
  }

  const numChannels = colors[0].length

  return { format, version, fixedAlpha, numColors, numChannels, colors }
}

Palette.prototype.getColor = function (idx) {
  return this.colors[idx]
}

Palette.prototype.setColor = function (idx, color) {
  this.colors[idx] = color
  return this
}

Palette.prototype.getFormat = function () {
  return this.format
}

Palette.prototype.getFixedAlpha = function () {
  return this.fixedAlpha
}

Palette.prototype.setFixedAlpha = function (alpha) {
  this.fixedAlpha = alpha
  return this
}

Palette.prototype.getNumColors = function () {
  return this.numColors
}

Palette.prototype.getNumChannels = function () {
  return this.numChannels
}

Palette.prototype.toString = function () {
  let output = ''
  output = output + this.format + '\n' +
                  this.version + '\n' +
                  this.colors.length + '\n'

  if (this.fixedAlpha) {
    output = output + '$ALPHA ' + this.fixedAlpha + '\n'
  }

  output = output + this.colors.map(color => color.join(' ')).join('\n')

  return output
}
