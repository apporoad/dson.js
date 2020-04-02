const DSON = require('./dson')
const impls = require('./implements')

module.exports = (expression) => {
    var j =new JVD()
    for (key in impls) {
        j.reg(key, impls[key])
    }
    //traslator.translate(j,expression) 
    return j
}