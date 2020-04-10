var ljson = require('lisa.json')

/**
 * 判断是否是  所在节点 均是在唯一队列中 ，  如果都在唯一数组中，表示需要验证数组中的所有元素
 */
exports.isArrayUnique = (dotTree, data) =>{
    // abc.sdf 无  数组情况，返回false
    if(/\[\d*\]/.test(dotTree) == false){
        return false
    }
    //   'asdf[0]s[10]df' 情况直接排除
    if(/[1-9]\d*/.test(dotTree)){
        return false
    }
    var newDotTree =  dotTree.replace(/\[0+\]/g,'[]')
    var  array  =  ljson(data).get(newDotTree)
    return  array ?  array.length  == 1 : false
}