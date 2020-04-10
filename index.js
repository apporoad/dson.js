const DSON = require('./dson')
const impls = require('./implements')
const JVD = require('jvd.js')

exports.DSON = (selector) => {
    var d=new DSON()
    for (key in impls) {
        d.reg(key, impls[key])
    }
    d.selector = selector
    //traslator.translate(j,expression) 
    d.JVD = exports.JVD
    return d
}

var $ = async (data,options,expressionOrJVD) =>{
    if(data == null || data ==undefined){
        return null
    }
    if(expressionOrJVD == null || expressionOrJVD == undefined){
        return null
    }
    return await exports.DSON().expect(expressionOrJVD).doTest(data,options)
}

exports.JVD = (expression) =>{
    var j = JVD(expression)
    j.reg('$', $)
    return j
} 