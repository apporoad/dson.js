const DSON = require('./dson')
const impls = require('./implements')
const JVD = require('jvd.js')

const G = global || globalThis || window || {}
G.dsonExts = G.dsonExts || {}

exports.DSON = (selector) => {
    var d=new DSON()
    for (key in impls) {
        d.reg(key, impls[key])
    }
    //load global ext
    for(key in G.dsonExts){
        d.reg(key , G.dsonExts[key])
    }
    d.selector = selector
    //traslator.translate(j,expression) 
    d.JVD = exports.JVD
    return d
}

exports.DSON.reg = (key,implement)=>{
    G.dsonExts[key] = implement
}

var $ = async (data,options,expressionOrJVD) =>{
    if(data == null || data ==undefined){
        return null
    }
    if(expressionOrJVD == null || expressionOrJVD == undefined){
        return null
    }
    var r = await exports.DSON().expect(expressionOrJVD).doTest(data,options)
    return r
}

exports.JVD = (expression) =>{
    var j = JVD(expression)
    j.reg('$', $)
    return j
} 

exports.config = (configs)=>{
    configs = configs || {}
    //设置dson 配置项
    G.dsonConfigs = G.dsonConfigs || {}
    G.dsonConfigs = Object.assign({},G.dsonConfigs , configs)
}