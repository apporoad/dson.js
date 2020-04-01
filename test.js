
const DSON = require('./index')
const JVD = require('jvd.js')

var json = {
	"data": [{
		"id": "5ce232d2-92b1-499f-8d07-6de444df6847",
		"preSeqNo": "11100000000023059",
		"bizNo": "Z123420C0000",
		"type": "2",
        "bizType": "A",
        "insertTime": "2020-03-26 10:25:58",
		"insertUser": "aoir",
		"updateTime": "2020-03-30 14:35:39",
        "updateUser": "apporoad",
        "dCorpType": "1",
		"mode": "0514",
		"chgMarkcd": "1",
		"changeTimes": 5,
		"status": "A1",
		"dataSource": "2",
	}, {
		"id": "45fa2e7d-5a4f-4f33-8205-0059b8d08acc",
		"preSeqNo": "111000000000032551",
		"bizNo": "W567820C0111",
		"type": "2",
		"bizType": "B",
		"insertTime": "2099-03-26 10:25:58",
		"insertUser": "aoier",
		"updateTime": "2098-03-30 19:35:39",
        "updateUser": "LiSA",
        "dCorpType": "1",
		"mode": "0614",
		"chgMarkcd": "1",
		"changeTimes": 2,
		"status": "A1",
		"dataSource": "2",
	}, {
		"id": "45fa2e7d-5a4f-4f33-8205-0059b8d08add",
		"preSeqNo": "111000000000032552",
		"bizNo": "W567820_0222",
		"type": "3",
		"bizType": "B",
		"insertTime": "2019-03-26 10:25:58",
		"insertUser": "aoier",
		"updateTime": "2028-03-30 19:35:39",
        "updateUser": "LiSA",
        "dCorpType": "1",
		"mode": "0714",
		"chgMarkcd": "1",
		"changeTimes": 3,
		"status": "A1",
		"dataSource": "2",
    }],
	"total": 104,
	"success": true,
	"code": 200,
	"message": null
}


//找到updateUser为LiSA的数据中 insertUser ，并校验是否为空，是否是LiSA

//判断 是否存在 updateTime <insertTime 的数据

// 获取 changeTimes 加和 并判断是否大于6

// 找到changeTimes 次数最多的数据 ， changeTimes 平均值

//找到所有bizType 的种类

// 找到字段长度为10的字段名称

// 校验bizNo 是否均符合要求

		
		

var dson = DSON().find({
    key : 'asdf'
}).test('?>10&<20').mark('hello')
.findDown('hello').test('!=1000')
.root().find('node').test({
    hello : "?='world'",
    cheers :[
        {
            hello : JVD().required().isArray()
        }
    ]
})


dson.do(json).then(data=>{
    console.log(data.hello)
})
dson.doTest(json)