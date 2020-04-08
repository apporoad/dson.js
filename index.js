const DSON = require('./dson')
const impls = require('./implements')

module.exports = (...defaultParams) => {
    var d=new DSON()
    for (key in impls) {
        d.reg(key, impls[key])
    }
    d.defaultParams = defaultParams
    //traslator.translate(j,expression) 
    return d
}