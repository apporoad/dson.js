// 这里是经典测试
const d = D = DSON = require('./index').DSON
const JVD = j = J = require('./index').JVD


var it2 = global.debug || it

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


// DSON().get('data').count().mark('dataCount').each()
// DSON().get('data').count().mark('dataCount').all()
// DSON().get('data').count().mark('dataCount').first()
// DSON().get('data').count().mark('dataCount').last()
// DSON().get('data').count().mark('dataCount').random()
// DSON().get('data').count().mark('dataCount').top()
// DSON().get('data').count().mark('dataCount').top(3)
// DSON().get('data').count().mark('dataCount').last(2).mark('last2')
// DSON().get('data').count().mark('dataCount').each().where({
// 	profile: {
// 		nice : '>60'
// 	}
// }).test({
// 			id : '?number&?nonRepeatable',
// 			job :  DSON().count().test('>0'),
// 			profile : {
// 				height : JVD().isNumber().between(100,200),
// 			}
// })


// DSON().get('data').count().mark('dataCount').all().where(DSON().find('job').all().where(DSON().get('long').where('>3').count().test('>0'))).mark('hello')
// DSON().get('data[]').where(DSON('job[]').where(DSON('long').where('>3').count().test('>0'))).mark('hello')

// DSON().get('data[].job[].long').sum()
// DSON().get('data[].job[].long').average().max().min().dateDiff().unique()//?
// DSON().get('data[].job[].name').trim().trimStart('start').trimEnd('end')
//     .toUpper().toLower().toUpperCase()
//     .toLowerCase().replace().substring().substr()
//     .order().format()
//     .select({
//         target : '',
//         newName : DSON('name')
//     })

