# dson

类似[JMESPath](https://jmespath.org/) ,但更偏向于二次扩展及声明方式表达对json的操作。  
设计目标：  
1. 二次开发使用
2. json数据抽取
3. 数据逻辑链式调用
4. 验证数据
5. json复杂查询
6. 拼接复杂json
7. format json
8. 简单集合操作




## 常用场景

### 查询操作

原始json如下： 

```js
{
  "name": "圣杯战争",
  "about": "Fate",
  "games": [
    {
      "name": "fate stay night",
      "masters": [
        {
          "name": "Shirou Emiya",
          "cnName": "卫宫士郎",
          "cv": "杉山纪彰",
          "height": 167,
          "weight": 58,
          "remark": "",
          "magics": [
            "投影"
          ]
        }
      ],
      "servants": [{ ...}]
    }
  ]
}
```

1. 获取值 get

方法： select/draw/get   实现同[LiSA.json](https://github.com/apporoad/LiSA.json)中get方法  <button onclick="demo('select')"> just try it </button>

```js 
dson().get('name')   => '圣杯战争'
dson('name')   =>  '圣杯战争'
dson().get('games[0].name') => 'fate stay night'
dson().get('games[].name') => ['fate stay night']
```

2. 寻找值 find

方法：  find    实现同[LiSA.json](https://github.com/apporoad/LiSA.json) 中find方法  <button onclick="demo('find')"> just try it </button>

```js
dson().find('name') 
    // =>  ["圣杯战争" , "fate stay night" , "Shirou Emiya" ...]
dson().find(/.*eight/g) 
    // => [167,58,154,42]
dson().find((key,value) =>{ return value &&  value.height && value.height == 167}) 
	// => [{"name":"Shirou Emiya","cnName":"卫宫士郎",...}]
dson().find(null,/.*Shirou.*/g)
	// => ["Shirou Emiya"]

```

### 模板查询 select

方法： select/draw/get   <button onclick="demo('template')"> just try it </button>

```js
dson().select({
    hello: 'world',
    name : '${_d.name}',
    gameName : 'games name is ${_d.games[0].name}'
})
// =>  {"hello":"world","name":"圣杯战争","gameName":"games name is fate stay night"}


```

### json格式化 format

方法：  format/render/select/draw/get  <button onclick="demo('format')"> just try it </button>

```js
dson().format({
    hello :'++${world}++',
    name : '${_d.name}'
}, { world : "hello hello good day"})
// => {"hello":"++hello hello good day++","name":"圣杯战争"}
```

### 链式操作 chain opreation

<button onclick="demo('chain')"> just try it </button>

```js
dson('games').select('[0]').select({
    hello : 'good good day',
    name : '${_d.name}'
})
// => {"hello":"good good day","name":"fate stay night"}
```

### 锚点功能 mark & autoMark

方法：  mark  <button onclick="demo('mark')"> just try it </button>

```js
dson().get('games[0]').mark('stayNight').get('masters[0]').select({
      name : 'master name is ${_d.name}',
      heigth : '${_d.height}',
      gameName : '${stayNight.name}',
      cv : '${get.cv}'
  })
//=>{"name":"master name is Shirou Emiya","heigth":167,"gameName":"fate stay night","cv":"杉山纪彰"}
```

ps: 其中 '${get.cv}' 用了autoMark，get的值即get('masters[0]')中的方法名，默认取值为最后一次该方法名的调用结果

### 集合操作

集合操作原始json 采用 [fate.json](https://apporoad.github.io/dson.js/js/fate.json)  <button onclick="demo('collection')"> just try it </button>

```js
dson('games').count()  //=> 2
dson('games[].masters').first().get('name')		//=>"Shirou Emiya"
dson('games[].masters').last(2).get('[]name')	//=>["Matou Kariya","Uryū Ryūnosuke"]
dson('games[].masters').random(2).get('[]name')	 // =>  .... 随机2个
dson('games[].masters').top(2).get('[]cnName') // => ["卫宫士郎","远坂凛"]
dson('games[].masters[]name').order() // => ["Emiya Kiritsugu","Illyasviel von Einzbern","Kayneth El-Melloi Archibaldu","Kirei Kotomine" ....]
dson('games[].masters[].weight').sum()  // => 774
dson('games[].masters[].weight').avg() // =>59.53846153846154
dson('games[].masters[].weight').max() // => 83
dson('games[].masters[].weight').min() // => 34

```

### 筛选操作 filter

方法：  filter/where <button onclick="demo('where')"> just try it </button>



### doTest

### 嵌套操作

## 练习

## apis



