var test = require('tape')
var roundCorner = require('./index')

test('Creates an arc when given a concave segment', function (t) {
  t.plan(1)

  var inputPoints = [
    [250, 1000],
    [400, 100],
    [750, 700]
  ]
  var inputInset = 500

  var expectedOutput = [
    [
      [ 250, 1000 ],
      [ 317.80050634732135, 593.1969619160718 ]
    ],
    {
      center: [ 495.9399404918536, 622.8868676068273 ],
      radius: 180.59664586381467,
      start: 3.30674133100442,
      end: 5.755110858753227
    },
    [
      [ 651.9355127620431, 531.8894504492167 ],
      [ 750, 700 ]
    ]
  ]

  var actualOutput = roundCorner(inputPoints, inputInset)

  t.deepEquals(expectedOutput, actualOutput, 'The input and output match')
})

test('Creates an arc when given a convex segment', function (t) {
  t.plan(1)

  var inputPoints = [
    [250, 1000],
    [400, 1500],
    [750, 700]
  ]
  var inputInset = 500

  var expectedOutput = [
    [
      [ 256.3260572168273, 1021.0868573894244 ],
      [ 250, 1000 ]
    ],
    {
      center: [ 432.1931687422075, 968.3267239318103 ],
      radius: 183.6106549161727,
      start: 0.41241044159738705,
      end: 2.850135859111926
    },
    [
      [ 750, 700 ],
      [ 600.4094170098539, 1041.9213325489054 ]
    ]
  ]

  var actualOutput = roundCorner(inputPoints, inputInset)

  t.deepEquals(expectedOutput, actualOutput, 'The input and output match')
})
