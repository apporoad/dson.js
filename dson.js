const utils = require('lisa.utils')

function DSON() {
    _this = this
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
                case 'draw':
                    console.log('DSON key string cannot be reged : ' + itemName)
                    return
                default:
                    this[itemName] = (...args) => {
                        _this._queue.push({
                            item: itemName,
                            params: args,
                            type: 'dson'
                        })
                        return _this
                    }
                    _this._implements[itemName] = implement
                    break;
            }
        }
    }
    this.add = this.reg

    /**
     * 执行抽取操作，返回context中的最后的值
     */
    this.doDraw = this.doSelect = async data =>{
        var context = await _this.do(data)
        return context.tempData
    }

    /**
     *  执行dson
     */
    this.do = this.run = this.go = async (data) => {
        var context = {
            root: data,
            currentData: data, //当前位置对应的数据
            tempData: data, //当前记录的数据
            marks: {},
            autoMarks: {},
            history: [],
            position: []
        }
        for (var index = 0; index < _this._queue.length; index++) {
            var current = _this._queue[index]
            var pureParams = current.params.length>0 ? current.params : (_this.defaultParams || [])
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
        }

        return context
    }
    this.doTest = () => {

    }
    return this
}

module.exports = DSON