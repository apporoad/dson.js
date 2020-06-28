const DSON = require('./dson')
const impls = require('./implements')
const JVD = require('jvd.js')

const G = globalThis || global || window || {}

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
    //dson中心服务路径
    configs.url = configs.url || '/dson'
    //dson外部缓存
    configs.cacher = configs.cacher || null
    //dson外部client 可以是 axios等等 
    configs.client = configs.client || null

    //设置dson 配置项
    G.dsonConfigs = configs
}