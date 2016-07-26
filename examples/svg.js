// Normally this would be `require('round-corner')`
var roundCorner = require('../index')

// Main runs immediately, just to organize the code a bit.
;(function main () {
  var path = createPathElement()

  // Create our line segment.
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

    // Generate the arc path, and set the path attribute
    path.setAttribute('d', generateArcPath(sequence))

    // Run the loop to animate.
    window.requestAnimationFrame(loop)
  })()
})()

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

function createPathElement () {
  var xmlns = 'http://www.w3.org/2000/svg'
  var width = window.innerWidth
  var height = window.innerHeight

  var svg = document.createElementNS(xmlns, 'svg')
  svg.setAttributeNS(null, 'viewBox', '0 0 ' + width + ' ' + height)
  svg.setAttributeNS(null, 'width', width)
  svg.setAttributeNS(null, 'height', height)

  Object.assign(svg.style, {
    position: 'absolute',
    top: 0,
    left: 0
  })

  var path = document.createElementNS(xmlns, 'path')

  Object.assign(path.style, {
    fill: 'none',
    stroke: 'black',
    'stroke-width': 3
  })

  svg.appendChild(path)
  document.body.appendChild(svg)

  return path
}
