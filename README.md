# dson.js
declarative operation encapsulation for json  
DSL for json

## 功能
## just to it
```bash
npm i --save dson.js
```
```js

var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON
var j = J = jvd = JVD = DSONJS.JVD

var v = null
//define dson
v =	dson('games').count()
v = dson().get('name') 
//v = dson('name') 
//v = dson().get('games[0].name') 
//v = dson().select('games[0].name') 
//v = dson().draw('games[0].name') 
//v = dson().get('games[].name'))
v = dson('games[0]').test({
  		name : "='fate stay night'",
    	masters : DSON().count().test('=6')
  	})

// here your json
var json = {
  "name": "圣杯战争",
  "about": "Fate",
  "games": [
    {
      "name": "fate stay night",
      "masters": [
        {
          "name": "Shirou Emiya",
          "cnName": "卫宫士郎"
        }
      ],
      "servants": [
        {
          "rank": "saber",
          "name": "Arutoria Pendoragon",
          "cnName": "阿尔托莉雅·潘德拉贡",
          "cv": "川澄绫子",
          "height": 154,
          "weight": 42,
          "BWH": "B73 W53 H76",
          "remark": "古不列颠传说中的亚瑟王，性格忠诚正直，谦逊有礼，个性认真。"
        }
      ]
    }
  ]
}

(async ()=>{
    //do select
    var result = await v.doSelect(json)

    // do test
    var isSuccess = await v.doTest(json)
})

```

## 如何扩展dson
### to extend one instance of DSON
```js
var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON
var di1 = d('name')
var di2 = d()

var json = {"name": "圣杯战争"}
//reg new method for dsonInstance 
di1.reg('hello',  (context, yourParam1,yourParam2) => {
  // your function can be async  or sync, here is sync
  //context is inner context object for dson
  // yourParam1 yourParam2 ... is your params

  //here to set result
  context.currentData = context.tempData = `${context.tempData},hello ${yourParam1} ${yourParam2}`
  //more details in document
})

di1.hello('world' , '!!!!')

//here error
di2.hello('ni','hao')

di1.doSelect(json).then(d=>{ console.log(d)})
//圣杯战争,hello world !!!!

```

### to extend DSON globally
```js
var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON

var json = {"name": "圣杯战争"}

//reg new method for DSON
d.reg('hi', async (context, yourParam1,yourParam2) => {
  context.currentData = context.tempData = `${context.tempData},hello ${yourParam1} ${yourParam2}`
})

var di3 = d('name')
var di4 = d('name')

di3.hi('ni','hao')
di4.hi(1,2,3)

di3.doSelect(json).then(d=>{ console.log(d)})
di4.doSelect(json).then(d=>{ console.log(d)})
//圣杯战争,hi ni hao
//圣杯战争,hi 1 2
```
examples:
1. [api.dson.js](https://github.com/apporoad/api.dson.js)  扩展dson，使其支持api调用

### to extend method preExe
```js
var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON

D.reg('$test', function(dsonObj, p1){
    console.log(p1)
})

d('test2').set('abc' , {hello : 1}).$test('yesyes')

```

## 常用场景
1. 对json校验
2. format json
3. 不固定json结构的抽取和校验
4. 支持扩展，对非编程场景的二次封装使用
5. 支持嵌套、模板嵌套等，支持复杂的声明式数据查询、渲染、校验，类sql，可以动态拼接实现动态逻辑
6. 可以支持序列化，支持网络传播（待实现）
7. 声明式及模板方式实现逻辑，使逻辑可视化，提高可读性，提高可修改性
8. 解析excel
9. 解析html


## todos
1. 执行的服务器客户端模式 dson server
2. servants   saber
3. 语言嵌套
4. [ok] serialize https://github.com/apporoad/dson.parser.js.git
5. format jvd  如 '>${a.b}'
6. webdrive 自动化测试
7.  [ok]  render   ' asdf ${a}sdf'
8. add  dson  verbose   打出每一步的执行结果
9. 支持cross 、x ，表示dson穿越，加载全局dson， 支持global，全局注册dson
10. 在cross中需要支持远程调用和缓存，需要找到默认实现 mini.req.js lisa.cache.js


# 细节场景
1. 抽出数据
2. 复杂抽出数据
3. 对数据做校验
4. format json
5. 神奇的使用



