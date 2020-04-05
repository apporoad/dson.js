const DSON = require('./dson')
const impls = require('./implements')

module.exports = (expression) => {
    var d=new DSON()
    for (key in impls) {
        d.reg(key, impls[key])
    }
    //traslator.translate(j,expression) 
    return d
}