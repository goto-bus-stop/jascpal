jascpal
=======

Jasc Paint Shop Pro Palette file library in Node.js.

[![NPM](https://nodei.co/npm/jascpal.png?compact=true)](https://nodei.co/npm/jascpal)

## Usage Example

```javascript
let Palette = require('jascpal')
let { readFileSync, writeFileSync } = require('fs')

let pal = Palette(readFileSync('my-palette.pal'))

// pal is now an extended array of [r, g, b] colour arrays
pal.getColor(0) //→ colour at index 0
pal[0] //→ colour at index 0
pal.getColor(12) //→ colour at index 12
pal.setColor(0, [ 0xff, 0x00, 0x77 ]) //→ colour at index 0 is now #ff0077
pal[12] = [ 0xff, 0xff, 0xff ] //→ colour at index 12 is now #ffffff
pal.toString() // or
(pal + '')     //→ new palette file source

writeFileSync('my-new-palette.pal', pal.toString())

```

## WTF?

Jasc Paint Shop Pro Palette files are used in the Genie engine, of Age of Empires 2 fame, and probably somewhere else. (Paint Shop Pro? Maybe? I wouldn't know!)

## API

### let pal = Palette(buf|string)

Parses a Buffer or string into an array of colours.

### let pal = Palette(array)

Adds the below Palette methods to the given array.

### let pal = Palette()

Creates a new colour array with the below Palette methods.

### pal[0] or pal.getColor(0)

Gets the colour at a given index. Colours are plain old `[ r, g, b ]` or `[ r, g, b, a ]` arrays,
with integers between 0 and 255. Returns `undefined` if there is no colour at the given index.

### pal[0] = color or pal.setColor(0, color)

Sets the colour at a given index. Note that it doesn't actually *check* if you've put in valid colours.
The `setColor` method also returns the palette so you can chain it (`pal.setColor(0, color0).setColor(2, color2)`).

### pal.getFormat()

Gets the format header string of the file, which is either `JASC-PAL` or `JASC-PALX`.

### pal.getFixedAlpha()

Gets the fixed alpha value for all colors in the palette. Returns `undefined` if there currently is
no fixed alpha value set.

### pal.setFixedAlpha(0)

Sets the fixed alpha value for the palette. It should be a value between 0 and 255.

### pal.getNumColors()

Gets the number of color entries in the palette.

### pal.getNumChannels()

Gets the number of channels used for each color. `[ r, g, b ]` colors would be 3 channels,
`[ r, g, b, a ]` would be 4.

### (pal + '') or pal.toString()

"Unparses" the colour array into a proper Palette source string.
