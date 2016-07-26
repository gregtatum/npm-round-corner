// Normally this would be `require('round-corner')`
var roundCorner = require('../index')

// Main runs immediately, just to organize the code a bit.
;(function main () {
  // Set up the canvas, place it on the screen, and get the 2d context.
  var ctx = initCtx()

  // Create our line segment
  var line = [
    [250, 1000],
    [400, 100],
    [750, 700]
  ]

  // Immediately run and loop some code.
  ;(function loop () {
    // Change the inset over time to illustrate the functionality.
    var t = (Math.sin(Date.now() * 0.001) + 1) / 2
    var inset = 500 * t

    // This is the sequence of [segment, arc, segment].
    var sequence = roundCorner(line, inset)

    // Draw everything.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    drawCanvas2dArc(ctx, sequence)
    drawDebugView(ctx, line)

    // Run the loop to animate.
    window.requestAnimationFrame(loop)
  })()
})()

function drawCanvas2dArc (ctx, sequence) {
  // Grab the elements out of the array. Normally I would do this with ES6 style array
  // destructuring like so: const [segmentA, arc, segmentB] = sequence
  var segmentA = sequence[0]
  var arc = sequence[1]
  var segmentB = sequence[2]

  // Draw it!
  ctx.beginPath()
  ctx.moveTo(segmentA[0][0], segmentA[0][1])
  ctx.lineTo(segmentA[1][0], segmentA[1][1])
  ctx.arc(arc.center[0], arc.center[1], arc.radius, arc.start, arc.end)
  ctx.moveTo(segmentB[0][0], segmentB[0][1])
  ctx.lineTo(segmentB[1][0], segmentB[1][1])
  ctx.lineWidth = 4
  ctx.strokeStyle = '#000'
  ctx.stroke()
}

function drawDebugView (ctx, line) {
  var a = line[0]
  var b = line[1]
  var c = line[2]
  // Draw sides of corner
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 2
  ctx.moveTo(a[0], a[1])
  ctx.lineTo(b[0], b[1])
  ctx.lineTo(c[0], c[1])
  ctx.stroke()
}

function initCtx () {
  // Do some work to create an init the canvas.
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  Object.assign(canvas.style, {
    position: 'absolute',
    top: 0,
    left: 0
  })

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  document.body.appendChild(canvas)
  return ctx
}
