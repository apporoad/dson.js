
const d = D = DSON = require('./index').DSON
const LJ = require('lustjson.js')
const sxg = require('./sxg')
const JVD = require('./index').JVD
const utils = require('lisa.utils')

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

it('test basic', async () => {

	// var masks = await DSON().get("data[0].mode").mark('oneMode').do(json)	
	// expect(masks.oneMode).toBe('0514')

	// var masks2 = await DSON().get('[0].mode').mark('twoMode').do(json.data)
	// expect(masks2.twoMode).toBe('0514')

	// var masks3  = await DSON().find('updateUser').mark('users').do(json)
	// expect(masks3.users.length).toBe(3)

	var masks4 = (await DSON().get('data[0]').find('updateUser').mark('users').do(json)).marks
	expect(masks4.users.length).toBe(1)

	var testRoot = (await DSON().get('data[0]').root().find('updateUser').mark('users').do(json)).marks
	expect(testRoot.users.length).toBe(3)

	var selectFn = j => { return j.changeTimes }
	var all = await DSON().find('updateUser').count().mark('count')
		.first().mark('first')
		.root().get('data').last().mark('last')
		.root().find('updateUser').last(2).mark('last2')
		.root().find('updateUser').top(2).mark('top2')
		.root().find('updateUser').random(2).mark('random2')
		.root().find('data').first().distinct((a, b) => { return a.updateUser == b.updateUser }).mark('distinct')
		.root().find('changeTimes')
		.sum().mark('sum1')
		.average().mark('avg1')
		.max().mark('max1')
		.min().mark('min1')
		.root().get('data')
		.sum(selectFn).mark('sum2')
		.avg(selectFn).mark('avg2')
		.max((a, b) => { return a.changeTimes > b.changeTimes }).mark('max2')
		.min((a, b) => { return a.changeTimes > b.changeTimes }).mark('min2')
		.root().find('updateUser').unique((a, b) => { return a == b }).mark('unique')
		.pre().mark('p1')
		.get('[0]')
		.pre().mark('p2')
		.do(json)
	var marks10 = all.marks
	var automarks10 = all.autoMarks

	expect(marks10.count).toBe(3)
	expect(marks10.first).toBe('apporoad')
	expect(marks10.last.status).toBe('A1')
	expect(marks10.last2[0]).toBe('LiSA')
	expect(marks10.top2[0]).toBe('apporoad')
	expect(marks10.random2.length).toBe(2)
	expect(marks10.distinct.length).toBe(2)
	expect(marks10.sum1).toBe(10)
	expect(marks10.avg1 > 3).toBeTruthy()
	expect(marks10.max1).toBe(5)
	expect(marks10.min1).toBe(2)
	expect(marks10.sum1 == marks10.sum2).toBeTruthy()
	expect(marks10.avg1 == marks10.avg2).toBeTruthy()
	expect(marks10.max1 == marks10.max2.changeTimes).toBeTruthy()
	expect(marks10.min1 == marks10.min2.changeTimes).toBeTruthy()
	expect(marks10.unique[0]).toBe('apporoad')

	expect(automarks10.unique[0]).toBe('apporoad')
	expect(marks10.p1 == marks10.p2).toBeTruthy()

})

//test sxg
it('test sxg', async () => {
	var json = [{
		hello: "            goood  good day      ",
		peers: [
			{
				hi: '           L   i     S             A                '
			}
		],
		test : {
			lily : true
		}
	}]
	var options = {
		stringHandler: (str) => {
			if (str)
				return str.trim()
			return str
		},
		othersHandler : (obj) =>{
			if(obj && obj.lily == true){
				return 'hello lily'
			}
		}
	}
	var newJson = await LJ.get(utils.deepCopy(json),sxg,options)
	expect(json[0].hello).toBe("            goood  good day      ")
	expect(newJson[0].hello).toBe("goood  good day")
	expect(newJson[0].test).toBe('hello lily')
})

//test trim and so on
it('test str operation', async () => {
	var json = [{
		trim: "  la la  ",
		trimStart : '  start  ',
		trimEnd : '  end  ',
		upper : 'abc',
		lower : 'ABCDEF',
		replace : '${abc}ced',
		replaceObj : {
			r : true
		},
		replaceArray : [
			'${abc}eee',
			{
				r:true
			},
			'hello'
		]
	}]

	var all = await DSON().get('[0]').mark('obj').mark().get('trim').trim()
		.goto().trimAll()
		.goto('obj').get('upper').toUpper().mark('u1')
		.goto('obj').toUpper().mark('u2')
		.goto('obj').get('lower').toLower().mark('l1')
		.goto('obj').toLower().mark('l2')
		.goto('obj').get('trimStart').trimStart()
		.goto().trimStartAll(' ')
		.goto().get('trimEnd').trimEnd()
    	.goto().trimEndAll(' ')
		.goto().get('replace').replace('${abc}','hello')
		.goto().replaceAll('${abc}','hello').mark('r1')
		.goto('obj').replaceAll(null,'hi',(a,b)=>{ 
			return a ? (a.r  || false) : false
		}).mark('r2')
		.do(json)

	expect(all.marks.l1).toBe('abcdef')
	expect(all.marks.l2.lower).toBe('abcdef')
	expect(all.marks.u1).toBe('ABC')
	expect(all.marks.u2.upper).toBe('ABC')
	expect(all.autoMarks.trim).toBe('la la')
	expect(all.autoMarks.trimAll.trim).toBe('la la')
	expect(all.autoMarks.trimStart).toBe('start  ')
	expect(all.autoMarks.trimStartAll.trimStart).toBe('start  ')
	expect(all.autoMarks.trimEnd).toBe('  end')
	expect(all.autoMarks.trimEndAll.trimEnd).toBe('  end')
	expect(all.autoMarks.replace).toBe('helloced')
	expect(all.marks.r1.replace).toBe('helloced')
	expect(all.marks.r2.replaceObj).toBe('hi')
	expect(all.marks.r2.replaceArray[1]).toBe('hi')

	expect( await DSON().get('[0].upper').doDraw(json)).toBe('abc')
})

// 参数设置为 选择器
// it('test defaultParams', async()=>{
// 	var json = {
// 		hello : ' lLiSA '
// 	}
// 	var result = await DSON([' ','l']).trimStartAll().doSelect(json)
// 	expect(result.hello).toBe('LiSA ')
// })

//找到updateUser为LiSA的数据中 insertUser ，并校验是否为空，是否是LiSA

//判断 是否存在 updateTime <insertTime 的数据

// 获取 changeTimes 加和 并判断是否大于6

// 找到changeTimes 次数最多的数据 ， changeTimes 平均值

//找到所有bizType 的种类

// 找到字段长度为10的字段名称

// 校验bizNo 是否均符合要求




// var dson = DSON().find({
//     key : 'asdf'
// }).test('?>10&<20').mark('hello')
// .find('hello').test('!=1000')
// .root().find('node').test({
//     hello : "?='world'",
//     cheers :[
//         {
//             hello : JVD().required().isArray()
//         }
//     ]
// })


// dson.do(json).then(data=>{
//     console.log(data.hello)
// })
// dson.doTest(json)



var testJson = {
	hello: 'good good day',
	data: [
		{
			id: 1,
			name: 'LiSA',
			job: [{
				name: 'singer',
				long: 11,
				remark: 'main job'
			}, {
				name: 'wife',
				long: 0
			}],
			profile: {
				height: 165,
				weight: 48,
				nice: 95
			}
		}, {
			id: 2,
			name: 'luna',
			job: [{
				name: 'singer',
				long: 8,
				remark: 'main job'
			}, {
				name: 'model',
				long: 5
			}],
			profile: {
				height: 155,
				weight: 45,
				nice: 93
			}
		}, {
			id: 3,
			name: 'eir',
			job: [{
				name: 'singer',
				long: 8,
				remark: 'main job'
			}],
			profile: {
				height: 160,
				weight: 50,
				nice: 99
			}
		}, {
			id: 1,
			name: 'fade',
			job: [{
				name: 'actor',
				long: 3,
				remark: 'main job'
			}, {
				name: 'singer',
				long: 1
			}],
			profile: {
				height: 170,
				weight: 65,
				nice: 50
			}
		}, {
			id: 5,
			name: 'zhoubichang',
			job: [{
				name: 'singer',
				long: 3,
				remark: 'main job'
			}, {
				name: 'wife',
				long: 3
			}],
			profile: {
				height: 162,
				weight: 55,
				nice: 34
			}
		}, {
			id: 6,
			name: 'moti',
			job: [{
				name: 'singer',
				long: 3
			}, {
				name: 'zhibo',
				long: 3
			}],
			profile: {
				height: 148,
				weight: 43,
				nice: 97
			}
		}
	]
}

it('test selector', async()=>{
	var json = {
		hi : 'good day',
		num : [1,2,3]
	}
	expect(await d('hi').doDraw(json)).toBe('good day')
	expect(await d('num[1]').doDraw(json)).toBe(2)
	
})

it2('test test/expect' , async()=>{
	var json = {
		hi : 'good day',
		num : [1,2,3]
	}
	expect(await d('hi').test('>3').doTest(json)).toBeTruthy()
	expect(await d('num').test('>4').doTest(json)).toBe(false)
	expect(await d('num').test(JVD('<4')).doTest(json)).toBe(true)
	expect(await d('num').test(JVD().gt(5).or().lt(4)).doTest(json)).toBe(true)
	//todo test $

	expect(await d('num').test(DSON('num').test('>2').get('[1]').test('=2')).doTest(json)).toBe(true)
	//var result = await DSON().test('>2').get('[1]').print().test('?=1').doTest(json.num)
	expect(await d('num').test(DSON().test('>2').get('[1]').print().test('?=1')).doTest(json)).toBe(false)
})

// it2('test where / filter     &   test / expect',async ()=>{
// 	d().get('data').where(d('job').get().test('>2')).print()
// 	d().get('data').where(d('job').get().test(JVD().gt(2))).print()
// 	d().get('data').where(d('job').get().count().test(JVD().gt(2))).print()
// 	d('data').get().where((data,context)=>{ return data.job.length > 2}).print()
// 	d('data').get().where({job:'>2'}).print()

// 	//寻找美女的名字
// 	d('data').where(JVD().$(d('profile.height').expect('?(155,175)').$(d('profile.height').expect('?(45,57.5')).or().$(d('profile.nice').test('>95')))).find('name').print()
// 	d('data').where(JVD().$({
// 		profile:{
// 			height : '?(155,175)',
// 			weight: '?(45,57.5)'
// 		}
// 	}.or().$({
// 		profile: { nice : ">95"}
// 	}))).find('name').print()
// })

it('test format', async()=>{

})


it('test get/fetch/select/draw/extract', async ()=>{

})

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
