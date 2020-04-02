const utils = require('lisa.utils')
const ljson = require('lisa.json')

exports.get = (context,expression)=>{
    if(expression && context.currentData){
        if(utils.Type.isObject(context.currentData) || utils.Type.isArray(context.currentData)){
            context.currentData = context.tempData 
                = ljson(context.currentData).get(expression)
        }
    }
}

exports.mark = (context, name)=>{
    if(name){
        context.marks[name] = context.tempData
    }
}

exports.find =async (json,keyOrFilter,value)=>{
   return await ljson(json).find(keyOrFilter,value)
}

exports.root = ()=>{}
exports.each =()=>{}
exports.all = ()=>{}
exports.count =1
exports.first = 2
exports.last = 3
exports.random =4
exports.top = 4
exports.where =1
exports.filter = 1
exports.distinct =2
exports.sum = 3
exports.average =1
exports.max=3
exports.min=3
exports.dataDiff=3
exports.unique=3
exports.trim = 3
exports.trimStart =1
exports.trimEnd =1
exports.toUpper=1
exports.toUpperCase=1
exports.toLower=1
exports.toLowerCase=1
exports.replace =1
exports.substr
exports.substring
exports.format
exports.order
exports.select
