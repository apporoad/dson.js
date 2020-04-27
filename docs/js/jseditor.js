var storage = window.localStorage

var module = module || {}
module.exports = module.exports || null
var exports = null

//测试使用，可以不用
var testJson = testJson = null

function run (method) {
    if ((module.exports  || exports ) && method) {
        var dson = (module.exports || exports)()
        if (dson && dson.isDSON && dson.isDSON()) {
            if (testJson) {
                dson[method](testJson).then(data => {
                    console.log(data)
                    document.getElementById('pre').innerText = JSON.stringify(data)
                })
            } else {
                //jsonedit
                var json = JSON.parse(storage.getItem('jsonedit'))
                dson[method](json).then(data => {
                    console.log(data)
                    document.getElementById('pre').innerText = JSON.stringify(data)
                })
            }
        }
    }
}

function doSelect() {
    run('doSelect')
}

function doTest() {
    run('doTest')
}

function AddControls() {
    var bt1 = document.createElement("button");
    bt1.innerHTML = 'doSelect';
    bt1.onclick = doSelect
    document.body.appendChild(bt1);

    var bt2 = document.createElement("button");
    bt2.innerHTML = 'doTest';
    bt2.onclick = doTest
    document.body.appendChild(bt2);

    var pre = document.createElement("pre")
    pre.id = 'pre'
    var div =document.createElement('div')
    div.appendChild(pre)
    document.body.appendChild(div)
}



AddControls()