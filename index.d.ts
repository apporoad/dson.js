declare class JVD{
    test(itemName : string, implement : Function)
}

declare class DSON{
    /**
     * reg new method for this DSON object
     * 给该dson注册新方法
     * @param itemName 方法名
     * @param implement 实现，同步函数或者异步函数
     */
    reg(itemName : string, implement : Function) 

    /**
     * just as reg
     * @param itemName 
     * @param implement 
     */
    add(itemName : string, implement : Function)

    /**
     * 是否是DSON实例，返回true
     */
    isDSON() : Boolean

    /**
     * 数据抽取，返回DSON链最后的值
     * @param data 数据  json or Array
     * @param options 
     */
    doDraw (data :Object, options?: Object) : Promise

    /**
     * just as doDraw
     */
    doSelect(data :Object, options?: Object) : Promise

    /**
     * 执行dson ，返回所有DSON过程对象
     * @param data json or Array
     * @param options 
     */
    do(data : Object,options? : Object) : Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    run(data : Object,options? : Object) : Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    go(data : Object,options? : Object) : Promise

    /**
     * 执行测试， 返回true or false
     * @param data  json or Array
     * @param options 
     */
    doTest (data:Object, options?: Object) : Promise

    
}

declare function JVD(experssion:string): JVD
declare function DSON(experssion) : DSON

export = {
    DSON : DSON,
    JVD : JVD
}
