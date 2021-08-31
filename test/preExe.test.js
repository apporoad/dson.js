const d = D = DSON = require('../index').DSON
const LJ = require('lustjson.js')
const sxg = require('../sxg')
const JVD = require('../index').JVD
const utils = require('lisa.utils')
const sxgGet = require('../sxgGet')

var it2 = global.debug || it

it2('test preExe' , async ()=>{
    D.reg('$test', function(obj, p1){
        
        expect(p1).toBe('yesyes')
    })

    d('test2').set('abc' , {hello : 1}).$test('yesyes')

})

