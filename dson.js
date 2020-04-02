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

    this.do = this.run = this.go = (data) => {
  
    }
    this.test = ()=>{}
    this.doTest =()=>{

    }

    return this
}

module.exports = DSON