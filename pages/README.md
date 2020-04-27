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

#### 获取值 get

方法： select/draw/get   实现同[LiSA.json](https://github.com/apporoad/LiSA.json)中get方法  <button onclick="demo('select')"> just try it </button>

```js 
dson().get('name')   => '圣杯战争'
dson('name')   =>  '圣杯战争'
dson().get('games[0].name') => 'fate stay night'
dson().get('games[].name') => ['fate stay night']
```

#### 寻找值 find

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



### 模板查询 doSelect

### 链式操作 chain opreation

### 集合操作

### 筛选操作 filter

### doTest

### format

### 嵌套操作

## 练习

## apis



