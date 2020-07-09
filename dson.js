const utils = require('lisa.utils')
const uType = utils.Type

/**
 * 将数组变化为单向链表
 * @param {*} array 
 */
const arrayToChainList= (array)=>{
    if(array&& array.length && array.length>0){
        var chain = { data : array[0]}
        var current =chain
        for(var i = 1;i<array.length;i++){
            current.next ={ data :  array[i]}
            current = current.next
        }
        return chain
    }
    return null
}

function DSON() {
    var _this = this
    this._implements = {}
    this._queue = []
    this.reg = (itemName, implement) => {
        if (itemName && (utils.Type.isFunction(implement) || utils.Type.isAsyncFunction(implement))) {
            switch (itemName) {
                case 'do':
                case 'doTest':
                case 'reg':
                case 'add':
                case 'run':
                case 'go':
                case 'doDraw':
                    console.log('DSON key string cannot be reged : ' + itemName)
                    return
                default:
                    var itemFunction = (...args) => {
                        _this._queue.push({
                            item: itemName,
                            params: args,
                            type: 'dson'
                        })
                        return _this
                    }
                    this[itemName] = itemFunction
                    _this._implements[itemName] = implement
                    break;
            }
        }
    }
    this.add = this.reg

    this.isDSON=()=>{return true}

    /**
     * 执行抽取操作，返回context中的最后的值
     */
    this.doDraw = this.doSelect = async (data,options) =>{
        var context = await _this.do(data,options)
        return context.tempData
    }

    /**
     *  执行dson
     */
    this.do = this.run = this.go = async (data,options) => {
        var context = {
            root: data,
            currentData: data, //当前位置对应的数据
            tempData: data, //当前记录的数据
            marks: {},
            autoMarks: {},
            history: [],
            position: [],
            test : [],
            JVD : _this.JVD,
            this : _this   //用于如 global等注册操作
        }
        //串上下文情况 ,只有mark autoMarks history进行传递
        if(options && uType.isObject(options.context)){
            context.marks = options.context.marks || {}
            context.autoMarks = options.context.autoMarks || {}
            context.history = options.context.history || []
            //test 不传递
            //context.test = options.context.test || []
            context.JVD = options.context.JVD
        }
        //传递
        if(options)
            context.defaultReplacementJson = options.replacementJson
        //selector
        if(_this.selector && _this._implements['select']){
            await Promise.resolve(_this._implements['select'].apply(_this, [context,_this.selector]))
            context.root = context.currentData
        }
        //链表化，为了不污染正常队列，并支持动态添加节点
        var currentObj =  arrayToChainList(_this._queue)
        while(currentObj){
            var current = currentObj.data
            var pureParams = current.params.length>0 ? current.params : ([]) //this.defaultParams  
            //上下文添加当前链表节点，用于cross动态添加node
            context.currentChainNode = currentObj
            var params = [context].concat(pureParams)
            await Promise.resolve(_this._implements[current.item].apply(_this, params))
            if (current.item != 'mark') {
                //auto mark
                context.autoMarks[current.item] = context.tempData
                // postion 也通用不记录mark情况
                if (context.position.length == 0 || (context.position.length > 0 && context.position[context.position.length - 1] != context.currentData)) {
                    context.position.push(context.currentData)
                }
            }
            //history mark也有历史
            context.history.push({
                key: current.item,
                params : params,
                value: context.tempData
            })

            currentObj = currentObj.next
        }
        return context
    }
    this.doTest = async (data, options) => {
        var c = await _this.do(data,options)
        var result = null
        for(var i =0;i<c.test.length;i++){
            if(c.test[i] == null || c.test[i] == undefined){
                continue
            }
            if(!c.test[i]){
                result = false
                break
            }else{
                result = true
            }
        }
        return result
    }
    return this
}

module.exports = DSON