const utils = require('lisa.utils')
const uType = utils.Type

/**
 *   _this._queue.push({
                            item: itemName,
                            params: args,
                            type: 'dson'
                        })
 */

 var innerGetKeyByValue = (map ,value) =>{
     for(key in map){
         if(value == map[key]){
             return key
         }
     }
     return null
 }

 var innerGenerateKey= (functionMap) =>{
     functionMap._index = functionMap._index ?  functionMap._index + 1 : 1
    return functionMap._index
 }

 var innerJsonifyArgs = (args  , givenFuncitonMap , outFunctionMap) =>{
    var newArgs = [] 
    for(var i =0 ;i < args.length;i ++){
        var arg = args[i]
        var nArg = arg
        // 方法情况 转换为fm
        if(uType.isFunction(arg) || uType.isAsyncFunction(arg)){
            var key = innerGetKeyByValue(givenFuncitonMap || {}, arg)
            if(key){
                outFunctionMap[key]  = arg
                nArg = `[[${key}]]`
            }else{
                 key =  innerGetKeyByValue(outFunctionMap || {} , arg)
                 if(!key){
                     key = 'auto_' + innerGenerateKey(outFunctionMap)
                     outFunctionMap[key] = arg
                     nArg = `[[${key}]]`
                 }
                 else{
                     nArg = `[[${key}]]`
                 }
            }
        }else if(uType.isObject(arg)){
            //对象情况

        } else if(uType.isArray(arg)){

        }else if(uType.isRegExp(arg)){
            //todo  都转为一种格式
        }


        newArgs.push(nArg)
    }
    return newArgs
 }


exports.jsonify = (dson, givenFuncitonMap , outFunctionMap )=>{
    if(!( uType.isObject(dson) && uType.isFunction(dson.isDSON) && dson.isDSON())){
        return null
    }
    outFunctionMap = outFunctionMap || {}
    var json = {
        isJsonifiedDson  : true,
        queue :  []
    }
    for(var i=0;i<dson._queue.length ; i ++){
        var item = dson._queue[i]
        var  jsonifiedArgs  =  innerJsonifyArgs(item.params ,  givenFuncitonMap, outFunctionMap)
        json.queue.push({
            item :  item.item,
            params :  jsonifiedArgs,
            type : item.type
        })
    }
    return  json
}

exports.stringify = ()=>{

}

exports.parse = ()=>{

}