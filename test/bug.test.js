const d = D = DSON = require('../index').DSON
const LJ = require('lustjson.js')
const sxg = require('../sxg')
const JVD = require('../index').JVD
const utils = require('lisa.utils')
const sxgGet = require('../sxgGet')

var it2 = global.debug || it

var json = {
	"test": [{
		"name": "test",
		"version": 1590501279247,
		"uploadTime": "2020-05-26T13:54:39.247Z",
		"originFileName": "doc.md",
		"file": "test-1590501279247.zip",
		"sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	}],
	"test2": [{
		"name": "test2",
		"version": "22",
		"uploadTime": "2020-05-26T14:00:58.570Z",
		"originFileName": "doc.md",
		"file": "test2-22.zip",
		"sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	}]
}

it2('test bug' , async ()=>{

    var r = await d('test2').where({
version: '?="22"'
}).count().print().test('?>0').doTest(json)

    expect(r).toBe(true)

})

