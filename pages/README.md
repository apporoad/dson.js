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

### 判断校验 expect

方法： expect/test 	 <button onclick="demo('expect')"> just try it </button>

```js
dson('games[0].masters').count().expect('=6')   // => true
dson('games[0].masters').count().test('>5&&<7') // => true
dson('games[0].masters').count().test(JVD('>6'))  //=> false
dson('games[0].masters').count().test(JVD().gt(5).lt(7)) //=>false
dson('games[0].masters').count().test(JVD('>6').or().lt(7)) //=> true
dson('games[0]').mark('mark1').get('name').test("='fate stay night'")
    	.goto('mark1').get('masters').count().test(JVD('>7'))
	//=> false

dson('games[0]').test(dson().get('name').test("='1'").root().get('masters').test('=6'))
	//=> false

dson('games[0]').test(JVD().$(
    	dson().get('name').test('=1')
	).or().$(
		dson('masters').count().test('=6')
	))
	//=> true


//awesome
dson('games[0]').test({
  		name : "='fate stay night'",
    	masters : DSON().count().test('=6')
  	})
	//=> true

//more awesome
dson('games[0]').test({
        name : "='fate stay night'",
        masters : [{
            height : '>158'
        }]
    })
	//=> fasle

//function or async function
dson('games[0]').test(async (data,context)=>{
  	return data.name == 'fate stay night'  && data.masters[0].height > 158
  })
	//=> true

```

校验的规则基于jvd.js , 具体使用详见[jvd]()

### 筛选操作 filter

方法：  filter/where <button onclick="demo('where')"> just try it </button>

```js
dson('games[0].masters[]height').filter('>166')  //=>[167,167,193]
dson('games[0].masters[]').where(dson('height').test('>166')).get('[]name')
	//=>["Shirou Emiya","Shinji Matou","Kirei Kotomine"]

dson('games[0].masters[]').where(dson('height').test('>166'))
  	.where(dson('weight').test('<60')).get('[]name')
	//=> ["Shirou Emiya","Shinji Matou"]

//模板方式
dson('games[0].masters[]').where({
  	height : '>166',
    weight : '<60'
  }).get('[]name')
	//=>["Shirou Emiya","Shinji Matou"]

dson('games[0].masters[]').where((data,context)=>{
  	return data.height > 166 && data.weight < 60
  }).get('[]name')
	//=>["Shirou Emiya","Shinji Matou"]
```



### 常用重要命令

方法： print/debug  <button onclick="demo('common')"> just try it </button>

```js
dson().get('name').push('names')
  	.root().get('games[].name').push('names')
  	.goto('names').print().get('[0]').mark('m1')
  	.root().select({ love : ' world '}).mark('m2').debug(data=>{
  		alert(JSON.stringify(data))
  	}).select({
  		hello : 'hello hello good ${m2.love}',
    	names : '${names}',
    	hi : '${m1}'
  	})
//=> {"hello":"hello hello good  world ","names":["圣杯战争",["fate stay night","Fate/Zero"]],"hi":"圣杯战争"}
```

### 扩展



### 嵌套操作

## 练习

## apis



