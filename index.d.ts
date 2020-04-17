declare class JVD {
    //todo
    test(itemName: string, implement: Function)
}

declare class DSON {
    /**
     * reg new method for this DSON object
     * 给该dson注册新方法
     * @param itemName 方法名
     * @param implement 实现，同步函数或者异步函数
     */
    reg(itemName: string, implement: Function)

    /**
     * just as reg
     * @param itemName 
     * @param implement 
     */
    add(itemName: string, implement: Function)

    /**
     * 是否是DSON实例，返回true
     */
    isDSON(): Boolean

    /**
     * 数据抽取，返回DSON链最后的值
     * @param data 数据  json or Array
     * @param options 
     */
    doDraw(data: Object, options ? : Object): Promise

    /**
     * just as doDraw
     */
    doSelect(data: Object, options ? : Object): Promise

    /**
     * 执行dson ，返回所有DSON过程对象
     * @param data json or Array
     * @param options 
     */
    do(data: Object, options ? : Object): Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    run(data: Object, options ? : Object): Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    go(data: Object, options ? : Object): Promise

    /**
     * 执行测试， 返回true or false
     * @param data  json or Array
     * @param options 
     */
    doTest(data: Object, options ? : Object): Promise

    /**
     * 标记当前数据到 Marks列表
     * @param name mark name
     */
    mark(name: string): DSON

    /**
     * 在当前位置处查询需要的值，参数参考 ljson.find
     * @param keyOrFilter 
     * @param value 
     */
    find(keyOrFilter, value ? ): DSON

    /**
     * 回到根路径
     */
    root(): DSON

    /**
     * 统计当前数组的行数，当前位置不变化
     */
    count(): DSON

    /**
     * 位置跳转到当前数组的第一个元素
     */
    first(): DSON

    /**
     * 位置跳转到当前数组的最后一个元素
     */
    last(): DSON

    /**
     * 位置跳转到当前数组的随机多个元素
     * @param num  默认为1
     */
    random(num ? : Number): DSON

    /**
     * 位置跳转到当前数组的前几个元素
     * @param num 默认为1
     */
    top(num ? : Number): DSON

    /**
     * 位置跳转到去除重复值后的数组
     * @param compareFn 
     */
    distinct(compareFn ? : Function): DSON

    /**
     * 计算当前数组的加和，当前位置不变化
     * @param selectFn 取值函数，要求返回数值类型
     */
    sum(selectFn ? : Function): DSON

    /**
     * 计算当前数组的平均值，当前位置不变化
     * @param selectFn 取值函数，要求返回数值类型
     */
    average(selectFn ? : Function): DSON

    /**
     * 获取数组最大值，当前位置不变化
     * @param compareFn 比较函数 
     */
    max(compareFn ? : Function): DSON

    /**
     * 获取数组最小值，当前位置不变化
     * @param compareFn 比较函数 
     */
    min(compareFn ? : Function): DSON

    /**
     * 位置跳转到无重复元素组成的数组
     * @param equilsFn 比较函数
     */
    unique(equilsFn ? : Function): DSON

    /**
     * 回退到前?步
     * @param step 默认1
     */
    preNode(step ? : Number): DSON

    /**
     * just as preNode
     * @param step 默认1
     */
    pre(step ? : Number): DSON

    /**
     * 跳跃到指定锚点（mark），如果不指定锚点，自动跳转到上一个锚点
     * @param mark 锚点
     */
    goto(mark ? : string): DSON

    /**
     * just as goto
     * @param mark 
     */
    travel(mark ? : string): DSON

    /**
     * just as goto
     * @param mark 
     */
    chuanyue(mark ? : string): DSON

    /**
     * trim空格 只支持string
     */
    trim(): DSON

    /**
     * trim string 或者 Object
     */
    trimAll() : DSON

    /**
     * trim start
     * @param stringOrArray 需要trim的字符串或者字符串数组
     */
    trimStart(stringOrArray ? ):DSON

    /**
     * trim start of string or Object
     * @param stringOrArray 需要trim的字符串或者字符串数组
     */
    trimStartAll( stringOrArray?) :DSON

    /**
     * trim end of string
     * @param stringOrArray 需要trim的字符串或者字符串数组
     */
    trimEnd (stringOrArray?) :DSON

    /**
     * trim end of string or Object
     * @param stringOrArray 需要trim的字符串或者字符串数组
     */
    trimEndAll(stringOrArray?) :DSON

    /**
     * upperCase of string or Object
     */
    toUpperCase():DSON
    
    /**
     * short for toUpperCase
     */
    toUpper () : DSON

    /**
     * lowerCase of string or Object
     */
    toLowerCase():DSON

    /**
     * short for toLowerCase
     */
    toLower():DSON

    /**
     * 替换 ,支持字符串替换， 也支持其他类型替换，其他类型替换时调用 equilsFn
     * @param regex 替换表达式， 字符串或者RegExp， 也可以为其他类型
     * @param replaceValue 替换的值
     * @param equilsFn 比较函数，用于扩展
     */
    replace(regex, replaceValue, equilsFn?:Function) :DSON

    /**
     * 支持替换数组和对象
     * @param regex 
     * @param replaceValue 
     * @param equilsFn 
     */
    replaceAll (regex, replaceValue, equilsFn?:Function) :DSON

    /**
     * substr of string
     * @param from 
     * @param length 
     */
    substr(from:Number, length? :Number) :DSON

    /**
     * substring of string
     * @param start 
     * @param end 
     */
    substring ( start : Number, end?:Number):DSON

    /**
     * 排序
     * @param compareFn 比较函数
     */
    order(compareFn?: Function):DSON

    /**
     * just as order
     * @param compareFn 
     */
    sort(compareFn?: Function):DSON

    /**
     * 筛选数组
     * @param expressionOrDsonOrJvdOrTemplate jvd字符串表达式 dson jvd 或者模板
     */
    where (expressionOrDsonOrJvdOrTemplate) :DSON

    /**
     * just as where
     * @param expressionOrDsonOrJvdOrTemplate 
     */
    filter (expressionOrDsonOrJvdOrTemplate) :DSON
    
    /**
     * 获取数据
     * @param expression 表达式 支持ljson.get方式， 同步异步函数方式，DSON， 模板，数组模板
     * @param replacementJson format object
     */
    get(expression, replacementJson ? :Object) :DSON

    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    fetch(expression, replacementJson?: Object) :DSON
    
    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    select(expression, replacementJson?: Object) :DSON
 
    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    draw(expression, replacementJson?: Object) :DSON

    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    extract(expression, replacementJson?: Object) :DSON

    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    format (expression, replacementJson?: Object) :DSON

    /**
     * just as get
     * @param expression 
     * @param replacementJson 
     */
    render (expression, replacementJson?: Object) :DSON

    /**
     * 期待，用于测试
     * @param expressionOrDsonOrJvdOrTemplate 表达式 jvd表达式 JVD， DSON， 模板，数组模板
     * @param info 
     */
    test(expressionOrDsonOrJvdOrTemplate, info : Object) :DSON
    
    /**
     * just as test
     * @param expressionOrDsonOrJvdOrTemplate 
     * @param info 
     */
    expect (expressionOrDsonOrJvdOrTemplate, info : Object) :DSON

    /**
     * 控制台打印出当前值，用于测试
     */
    print () :DSON

    /**
     * push to marks
     * @param name 锚点
     */
    push(name :string):DSON

    /**
     * pop from marks
     * @param name 锚点 
     */
    pop(name:string):DSON

    /**
     * unshift to marks
     * @param name 锚点
     */
    unshift(name:string) :DSON

    /**
     * shift from marks
     * @param name 锚点
     */
    shift(name:string) :DSON

}

declare function JVD(experssion: string): JVD
declare function DSON(experssion): DSON

export = {
    DSON: DSON,
    JVD: JVD
}