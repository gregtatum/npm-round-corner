# Round Corners

Take two line segments and round the corner where they meet with an arc. This function is built to be un-opinionated about its end use and can be applied to Canvas 2d, SVG, D3, or whatever applications.

![Round corner example](http://gregtatum.com/tmp/round-corner.png)

### Example

```js
var roundCorners = require('round-corners')
var line = [
  [250, 1000],
  [400, 100],
  [750, 700]
]
var inset = 500

var sequence = roundCorners(line, inset)
// sequence === [segmentA, arc, segmentC]
```

### The result

The resulting sequence using ES6 destructuring notation takes the form:

```js
var [segmentA, arc, segmentB] = roundCorners(line, inset)
```

Or explicitly it looks like:

```js
[
  [
    [250, 1000],
    [317.8, 593.1]
  ],
  {
    center: [495.9, 622.8],
    radius: 180.5,
    start: 3.3,
    end: 5.7
  },
  [
    [651.9, 531.8],
    [750, 700]
  ]
]
```

# Example Usage

### 2d Canvas

This format lends itself to 2d canvas rendering. Here is an example of how to render the result.

```js
function drawCanvas2dArc (ctx, sequence) {
  var segmentA = sequence[0]
  var arc = sequence[1]
  var segmentB = sequence[2]

  ctx.beginPath()
  ctx.moveTo(segmentA[0][0], segmentA[0][1])
  ctx.lineTo(segmentA[1][0], segmentA[1][1])
  ctx.arc(arc.center[0], arc.center[1], arc.radius, arc.start, arc.end)
  ctx.moveTo(segmentB[0][0], segmentB[0][1])
  ctx.lineTo(segmentB[1][0], segmentB[1][1])
  ctx.lineWidth = 4
  ctx.strokeStyle = '#fff'
  ctx.stroke()
}
```

See [this RequireBin](http://requirebin.com/?gist=1f983fa07402e55b4cd2d04a17b020e0) for a live example.

### SVG

It can also be used with SVG with a few extra utility functions.

```js
// Run this function to calculate the "d" attribute for a path.
function generateArcPath (sequence) {
  var segmentA = sequence[0]
  var arc = sequence[1]
  var segmentB = sequence[2]

  return [
    drawLine(segmentA),
    drawArc(segmentA, arc, segmentB),
    drawLine(segmentB)
  ].join(' ')
}

function drawLine (segment) {
  return 'M' + segment[0][0] + ',' + segment[0][1] + ' ' +
         'L' + segment[1][0] + ',' + segment[1][1]
}

function drawArc (segmentA, arc, segmentB) {
  // We need to compute the rotation of the arc to match the needed SVG format.
  var rotation = toDegrees(Math.atan2(
    segmentB[0][1] - segmentA[1][1],
    segmentB[0][0] - segmentA[1][0]
  ))
  return [
    'A', arc.radius, arc.radius, rotation, 0, 1, segmentB[0][0], segmentB[0][1]
  ].join(' ')
}

function toDegrees (radians) {
  return radians / Math.PI * 180
}
```

See [this RequireBin](http://requirebin.com/?gist=d5ce508e7bb2e37bf828c0cacd5ddd06) for a live example.

## Running the examples

* Clone the repo, or navigate to the `./node_modules/round-corner` folder of the currently installed location.
* From the command line run `npm install`
* SVG example: run `npm run example:svg`
* Canvas example: run `npm run example:canvas`
