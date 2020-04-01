
const DSON = require('./index')


var dson = DSON().find({
    key : 'asdf'
}).test('?>10&<20').mark('hello')
.findDown('hello').test('')
.root()


dson.do({})
dson.doTest({})