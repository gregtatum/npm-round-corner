var vec2 = require('gl-vec2')

function roundCornerRouter (segment, inset, ctx) {
  // Convex angles fail, so have something before the real
  // function to re-order the segment and result, if convex.
  var a = segment[0]
  var b = segment[1]
  var c = segment[2]

  /**
   *   vectors
   *
   *   • •------>
   * v ^        w
   *   |
   *   |
   *   •
   */
  var vX = b[0] - a[0]
  var vY = b[1] - a[1]
  var wX = c[0] - b[0]
  var wY = c[1] - b[1]
  var theta = Math.atan2(vX, vY)
  var rotatedWX = wX * Math.cos(theta) - wY * Math.sin(theta)

  // See which way vector W rotates, left or right
  if (rotatedWX > 0) {
    var result = roundCorner(c, b, a, inset, ctx)
    var start = result[0]
    var end = result[2]
    result[0] = end
    result[2] = start
    return result
  } else {
    return roundCorner(a, b, c, inset, ctx)
  }
}

// Scratch variables to reduce memory allocations
var _s1 = [0.0, 0.0]
var _s2 = [0.0, 0.0]
var _s3 = [0.0, 0.0]
var _s4 = [0.0, 0.0]
var _s5 = [0.0, 0.0]
var _s6 = [0.0, 0.0]
var _s7 = [0.0, 0.0]
var _s8 = [0.0, 0.0]

function roundCorner (a, b, c, inset, ctx) {
  /**
   *    segment     rounded       vectors       midway
   *
   *    b --- c >      ,-- c >    • <------•    • <--•---•
   *    |            /            ^        w    ^   mw   w
   *    |           |             |             • mv
   *    a           a             |             |
   *    v           v           v •           v •
   */

  // Figure out some things about this vector
  var v = vec2.subtract(_s1, b, a)
  var w = vec2.subtract(_s2, b, c)
  var unitV = vec2.normalize(_s3, v)
  var unitW = vec2.normalize(_s4, w)
  var lengthV = vec2.length(v)
  var lengthW = vec2.length(w)

  // Make sure the target distance doesn't bust out of the segments
  var targetInset = Math.min(inset, vec2.length(v), vec2.length(w))
  var mv = vec2.add(_s5, vec2.scale(_s5, unitV, lengthV - targetInset), a)
  var mw = vec2.add(_s6, vec2.scale(_s6, unitW, lengthW - targetInset), c)
  var normalV = [-unitV[1], unitV[0]]
  var normalW = [unitW[1], -unitW[0]]

  // Find intersection of the normals
  // Given: mw + t × normalW = mv + u × normalV
  // t = (mv − mw) × normalW / (normalW × normalV)
  var distanceOnNormalV = (
    magCross(vec2.subtract(_s7, mv, mw), normalW) /
    magCross(normalW, normalV)
  )
  var arcCenter = vec2.add(_s8, mw, vec2.scale(_s8, normalW, distanceOnNormalV))
  var arcRadius = vec2.distance(mv, arcCenter)
  var arcStart = Math.PI + Math.atan2(normalV[1], normalV[0])
  var arcEnd = Math.PI + Math.atan2(normalW[1], normalW[0])
  var arc = {
    center: arcCenter,
    radius: arcRadius,
    start: arcStart,
    end: arcEnd
  }

  return [
    [a, mv],
    arc,
    [mw, c]
  ]
}

function magCross (v, w) {
  return v[0] * w[1] - v[1] * w[0]
}

module.exports = roundCornerRouter
