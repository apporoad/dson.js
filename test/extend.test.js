const d = D = DSON = require('../index').DSON
const JVD = require('../index').JVD
const utils = require('lisa.utils')

var it2 = global.debug || it

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


var di1 = d('name')
var di2 = d()

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
//here errrors
//di2.hello('ni','hao')

it2('test extend one instance of DSON', async()=>{
	var txt1 = await di1.doSelect(json)
	//var txt2 = await di2.doSelect(json)

	expect(txt1).toBe("圣杯战争,hello world !!!!")

})


// gobal reg

d.reg('hi',async (context, yourParam1,yourParam2) => {
  context.currentData = context.tempData = `${context.tempData},hi ${yourParam1} ${yourParam2}`
})

var di3 = d('name')
var di4 = d('name')

di3.hi('ni','hao')
di4.hi(1,2,3)

it2('test extend DSON', async()=>{
	var txt1 = await di3.doSelect(json)
	var txt2 = await di4.doSelect(json)

	expect(txt1).toBe("圣杯战争,hi ni hao")
	expect(txt2).toBe("圣杯战争,hi 1 2")

})

