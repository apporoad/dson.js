var ljson = require('lisa.json')
var utils = require('lisa.utils')

/**
 * 判断是否是  所在节点 均是在唯一队列中 ，  如果都在唯一数组中，表示需要验证数组中的所有元素
 */
exports.isArrayUnique = (dotTree, data) => {
    // abc.sdf 无  数组情况，返回false
    if (/\[\d*\]/.test(dotTree) == false) {
        return false
    }
    //   'asdf[0]s[10]df' 情况直接排除
    if (/[1-9]\d*/.test(dotTree)) {
        return false
    }
    var newDotTree = dotTree.replace(/\[0+\]/g, '[]')
    var array = ljson(data).get(newDotTree)
    return array ? array.length == 1 : false
}


exports.hasNeeds = (rawString) => {
    if (utils.indexOfString(rawString, '$') > -1) {
        if (/^\$[a-zA-Z0-9_\.\[\]]+$/.test(rawString)) {
            return true
        } else if (/^\$\{[a-zA-Z0-9_\.\[\]]+\}$/.test(rawString)) {
            return true
        } else if (/.*\$\{[a-zA-Z0-9_\.\[\]]+\}.*/.test(rawString)) {
            return true
        }
    }
    return false
}

exports.fillNeeds = (rawString, context) => {
    if (utils.indexOfString(rawString, '$') > -1) {
        if (/^\$[a-zA-Z0-9_\.\[\]]+$/.test(rawString)) {
            return ljson(context).get(rawString.substr(1))
        } else if (/^\$\{[a-zA-Z0-9_\.\[\]]+\}$/.test(rawString)) {
            var path = rawString.substring(2, rawString.length - 1)
            return ljson(context).get(path)
        } else if (/.*\$\{[a-zA-Z0-9_\.\[\]]+\}.*/.test(rawString)) {
            var str = rawString
            var array = rawString.match(/\$\{[a-zA-Z0-9\[\]_\.]+\}/g)
            if (array) {
                array.forEach(ele => {
                    var path = ele.substring(2, ele.length - 1)
                    str = str.replace(ele ,  ljson(context).get(path))
                })
                return str
            }
        }
    }
    return rawString
}