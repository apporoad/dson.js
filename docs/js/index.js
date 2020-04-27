var storage = window.localStorage

function abc (){
        alert('abc')
}

var simpleJson = {
  "name": "圣杯战争",
  "about": "Fate（フェイト）是TYPE-MOON原作的系列作品，于2004年1月30日发售的PC平台18禁文字冒险游戏《Fate/stay night》，同时也是TYPE-MOON商业化后初次亮相的作品。由于广受欢迎，吸引了一些作家参与制作，由本篇衍生诸多人气作品。",
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
      "servants": [
        {
          "rank": "saber",
          "name": "Arutoria Pendoragon",
          "cnName": "阿尔托莉雅·潘德拉贡",
          "cv": "川澄绫子",
          "height": 154,
          "weight": 42,
          "BWH": "B73 W53 H76",
          "remark": "古不列颠传说中的亚瑟王，性格忠诚正直，谦逊有礼，个性认真。",
          "ability": {
            "strength": "B",
            "durablity": "C",
            "agile": "C",
            "magic": "B",
            "lucky": "B",
            "treasure": "C"
          },
          "treasures": [
            {
              "name": "Excalibur",
              "cnName": "誓约胜利之剑",
              "level": "A++",
              "type": "对城宝具",
              "limit": "1~99",
              "catch": 1000
            }
          ]
        }
      ]
    }
]
}

var openEdit = (dson)=>{

    storage.setItem('CodeHere_jsStr',`var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON
exports = function(){
  var v = null
  ${dson}
  return v
}`)
    storage.setItem('jsonedit', JSON.stringify(simpleJson))
    storage.setItem('CodeHere_htmlHeight','5px')
    storage.setItem('CodeHere_leftWidth','587px')
    storage.setItem('CodeHere_htmlStr',`<link href="css/index.css" rel="stylesheet">
<script src = 'js/dson.js'></script>
<script src = 'js/jseditor.js'></script>`)
    storage.setItem('CodeHere_cssHeight','0px')
    window.open("edit.html")
}

function demo(name){
    switch(name){
        case 'select':
            openEdit(`  v = dson().get('name') 
  //v = dson('name') 
  //v = dson().get('games[0].name') 
  //v = dson().select('games[0].name') 
  //v = dson().draw('games[0].name') 
  //v = dson().get('games[].name')`)
            break
        case 'find':
            openEdit(`  v = dson().find('name')
  v = dson().find(/.*eight/)
  v = dson().find((key,value) =>{ return value &&  value.height && value.height == 167})
  v = dson().find(null,/.*Shirou.*/g)`)
            break
    }
}