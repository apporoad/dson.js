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
    return d
}

exports.JVD = JVD