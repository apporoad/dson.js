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

var fate = {
    "name" : "圣杯战争",
    "about" : "Fate（フェイト）是TYPE-MOON原作的系列作品，于2004年1月30日发售的PC平台18禁文字冒险游戏《Fate/stay night》，同时也是TYPE-MOON商业化后初次亮相的作品。由于广受欢迎，吸引了一些作家参与制作，由本篇衍生诸多人气作品。",
    "games" : [
        {
            "name": "fate stay night",
            "masters" :[
                {"name":"Shirou Emiya" , "cnName" : "卫宫士郎" , "cv" : "杉山纪彰", "height" : 167, "weight" : 58 , "remark":"" , "magics" : ["投影"]},
                {"name":"Rin Tohsaka" , "cnName" : "远坂凛" ,"cv": "植田佳奈" , "height" : 159 ,"weight":47 , "remark":""  , "BWH" : "B77 W57 H80", "magics":["宝石"]},
                {"name":"Sakura Matou" , "cnName": "间桐樱" , "cv" : "下屋则子" , "height": 156 , "weight":46 , "remark":"" , "BWH" : "B85 W56 H87", "magics":[]},
                {"name":"Illyasviel von Einzbern" , "cnName":"伊莉雅丝菲尔·冯·爱因兹贝伦" , "cv":"门胁舞以" , "height":133 ,"weight":34 , "remark" :"", "BWH":"B61 W47 H62"},
                {"name":"Shinji Matou" , "cnName" :"间桐慎二", "cv":"神谷浩史" , "height" : 167 , "weight":57, "remark":""},
                {"name":"Kirei Kotomine" , "cnName":"言峰绮礼" , "cv":"中田让治", "height":193 , "weight":82 ,"remark":""}
            ],
            "servants" :[
                {"rank": "saber" , "name":"Arutoria Pendoragon" , "cnName" :"阿尔托莉雅·潘德拉贡" ,"cv":"川澄绫子", "height" : 154 , "weight":42 ,"BWH":"B73 W53 H76", "remark":"古不列颠传说中的亚瑟王，性格忠诚正直，谦逊有礼，个性认真。",
                    "ability": { "strength": "B" , "durablity":"C" , "agile" : "C" ,"magic":"B", "lucky":"B" , "treasure": "C"},
                    "treasures" : [ 
                        {"name" :"Excalibur", "cnName" : "誓约胜利之剑" ,  "level" : "A++" , "type": "对城宝具", "limit": "1~99","catch": 1000},
                        {"name" :"Invisible Air", "cnName" : "风王结界" ,  "level" : "C" , "type": "对人宝具", "limit": "1~2","catch": 1},
                        {"name" :"Avalon", "cnName" : "遥远的理想乡" ,  "level" : "EX" , "type": "结界宝具", "limit": "1"}
                    ]
                },
                {"rank": "archer" , "name":"Emiya" , "cnName" :"卫宫士郎" ,"cv":"诹访部顺一", "height" : 187 , "weight":78 , "remark":"精于近身格斗战及弓术，亦擅长对魔术战和家务，本体为未来的卫宫士郎成为守护者后的姿态。可以说是影子主角般的重要角色",
                    "ability": { "strength": "D" , "durablity":"C" , "agile" : "C" ,"magic":"B", "lucky":"E" , "treasure": "?"},
                    "treasures" : [ 
                        {"name" :"Unlimited Blade Works", "cnName" : "无限剑制" ,  "level" : "E~A++" , "type": "固有结界", "limit": "?","catch": "?"},
                        {"name" :"干将·莫邪", "cnName" : "干将·莫邪" ,  "level" : "c-" , "type": "对人宝具", "limit": 1,"catch": 1}
                    ]
                },
                {"rank": "archer" , "name":"Gilgamesh" , "cnName" :"吉尔伽美什" ,"cv":"关智一", "height" : 182 , "weight":58 , "remark":"古代美索不达米亚地区苏美尔王朝的都市国家乌鲁克的第五任国王，人类最古老的史诗《吉尔伽美什史诗》的主人公，最古老的“英雄王”",
                    "ability": { "strength": "B" , "durablity":"C" , "agile" : "C" ,"magic":"B", "lucky":"A" , "treasure": "EX"},
                    "treasures" : [ 
                        {"name" :"Gate of Babylon", "cnName" : "王之财宝" ,  "level" : "E~A++" , "type": "对人宝具", "limit": "-"},
                        {"name" :"Enuma Elish", "cnName" : "天地乖离开辟之星" ,  "level" : "EX" , "type": "对界宝具", "limit": 99,"catch": 1000}
                    ]
                },
                {"rank": "Lancer" , "name":"Cú Chulainn" , "cnName" :"库·丘林" ,"cv":"神奈延年", "height" : 185 , "weight":70 , "remark":"“光之子”库·丘林",
                    "ability": { "strength": "B" , "durablity":"C" , "agile" : "A" ,"magic":"C", "lucky":"E" , "treasure": "B"},
                    "treasures" : [ 
                        {"name" :"Gáe Bolg", "cnName" : "刺穿死棘之枪" ,  "level" : "B" , "type": "对人宝具", "limit": "2~4","catch": 1},
                        {"name" :"Gáe Bolg", "cnName" : "突穿死翔之枪" ,  "level" : "B+" , "type": "对军宝具", "limit": "5~40","catch": 50}
                    ]
                },
                {"rank": "Rider" , "name":"Medusa" , "cnName" :"美杜莎" ,"cv":"浅川悠", "height" : 172 , "weight":58, "BWH" :"B88 W56 H84" , "remark":"",
                    "ability": { "strength": "C" , "durablity":"E" , "agile" : "B" ,"magic":"B", "lucky":"D" , "treasure": "A+"},
                    "treasures" : [ 
                        {"name" :"Bellerophon", "cnName" : "骑英之缰绳" ,  "level" : "A+" , "type": "对军宝具", "limit": "2~50","catch": 300},
                        {"name" :"Breaker Gorgon", "cnName" : "自我封印·暗黑神殿" ,  "level" : "C-" , "type": "对人宝具", "limit": "0","catch": 1},
                        {"name" :"Blood Fort Andromedan", "cnName" : "他者封印·鲜血神殿" ,  "level" : "B" , "type": "对军宝具", "limit": "10~40","catch": 500}
                    ]
                },
                {"rank": "Caster" , "name":"Medea" , "cnName" :"美狄亚" ,"cv":"田中敦子", "height" : 163 , "weight":51, "BWH" :"B82 W57 H84" , "remark":"",
                    "ability": { "strength": "E" , "durablity":"D" , "agile" : "C" ,"magic":"A+", "lucky":"B" , "treasure": "C"},
                    "treasures" : [ 
                        {"name" :"Rule Breaker", "cnName" : "万符必应破戒" ,  "level" : "C" , "type": "对魔术宝具", "limit": "1","catch": 1}
                    ]
                },
                {"rank": "Berserker" , "name":"Hercules" , "cnName" :"赫拉克勒斯" ,"cv":"西前忠久", "height" : 253 , "weight":311, "remark":"真身为希腊神话中宙斯之子大英雄赫拉克勒斯（海格力斯）",
                    "ability": { "strength": "A+" , "durablity":"A" , "agile" : "A" ,"magic":"A", "lucky":"B" , "treasure": "A"},
                    "treasures" : [ 
                        {"name" :"God Hand", "cnName" : "十二试炼" ,  "level" : "B" , "type": "对人宝具", "limit": "","catch": 1},
                        {"name" :"Nine Lives", "cnName" : "射杀百头" ,  "level" : "A" , "type": "?", "limit": "","catch": 1},
                        {"name" :"Boomelancer", "cnName" : "旋转突刺的蓝色枪兵" ,  "level" : "B+" , "type": "对人宝具", "limit": "1+","catch": 99999}
                    ]
                },
                {"rank": "Assassin" , "name":"Sasaki Kojiro" , "cnName" :"佐佐木小次郎" ,"cv":"三木真一郎", "height" : 176 , "weight":63, "remark":"“传说中的剑豪”佐佐木小次郎，剑技非凡，仅凭剑技就达到魔法甚至是宝具领域的剑豪。",
                    "ability": { "strength": "C" , "durablity":"E" , "agile" : "A+" ,"magic":"E", "lucky":"A" , "treasure": null},
                    "treasures" : []
                }
            ]
        },{
            "name" : "Fate/Zero",
            "masters" :[
                {"name":"Emiya Kiritsugu" , "cnName" : "卫宫切嗣" , "cv" : "小山力也", "height" : 175, "weight" : 67 , "remark":"" , "magics" : ["火","土"]},
                {"name":"Tohsaka Tokiomi" , "cnName" : "远坂时臣" ,"cv": "速水奖" , "height" : 177 ,"weight":68, "remark":""  , "magics":["火"]},
                {"name":"Kotomine Kirei" , "cnName": "言峰绮礼" , "cv" : "中田让治" , "height": 185 , "weight":83 , "remark":"" , "magics":[]},
                {"name":"Waver Velvet" , "cnName":"韦伯·维尔维特" , "cv":"植田慎一郎" , "height":157 ,"weight":50 , "remark" :""},
                {"name":"Kayneth El-Melloi Archibaldu" , "cnName" :"肯尼斯·艾尔梅洛伊·阿其波卢德", "cv":"山崎巧" , "height" : 181 , "weight":62, "remark":""},
                {"name":"Matou Kariya" , "cnName":"间桐雁夜" , "cv":"新垣樽助", "height":173 , "weight":55 ,"remark":""},
                {"name":"Uryū Ryūnosuke" , "cnName":"雨生龙之介" , "cv":"石田彰", "height":174 , "weight":65 ,"remark":""}
            ],
            "servants" :[
                {"rank": "saber" , "name":"Arutoria Pendoragon" , "cnName" :"阿尔托莉雅·潘德拉贡" ,"cv":"川澄绫子", "height" : 154 , "weight":42 ,"BWH":"B73 W53 H76", "remark":"古不列颠传说中的亚瑟王，性格忠诚正直，谦逊有礼，个性认真。",
                    "ability": { "strength": "B" , "durablity":"A" , "agile" : "A" ,"magic":"A", "lucky":"D" , "treasure": "A++"},
                    "treasures" : [ 
                        {"name" :"Excalibur", "cnName" : "誓约胜利之剑" ,  "level" : "A++" , "type": "对城宝具", "limit": "1~99","catch": 1000},
                        {"name" :"Invisible Air", "cnName" : "风王结界" ,  "level" : "C" , "type": "对人宝具", "limit": "1~2","catch": 1},
                        {"name" :"Avalon", "cnName" : "遥远的理想乡" ,  "level" : "EX" , "type": "结界宝具", "limit": "1"}
                    ]
                },
                {"rank": "archer" , "name":"Gilgamesh" , "cnName" :"吉尔伽美什" ,"cv":"关智一", "height" : 182 , "weight":58 , "remark":"古代美索不达米亚地区苏美尔王朝的都市国家乌鲁克的第五任国王，人类最古老的史诗《吉尔伽美什史诗》的主人公，最古老的“英雄王”",
                    "ability": { "strength": "B" , "durablity":"B" , "agile" : "B" ,"magic":"A", "lucky":"A" , "treasure": "EX"},
                    "treasures" : [ 
                        {"name" :"Gate of Babylon", "cnName" : "王之财宝" ,  "level" : "E~A++" , "type": "对人宝具", "limit": "-"},
                        {"name" :"Enuma Elish", "cnName" : "天地乖离开辟之星" ,  "level" : "EX" , "type": "对界宝具", "limit": 99,"catch": 1000}
                    ]
                },
                {"rank": "Assassin" , "name":"Hassan Sabbah" , "cnName" :"哈桑·萨巴赫" ,"cv":"川村拓央", "remark":"历代山中老人哈桑的其中之一",
                    "ability": { "strength": "C" , "durablity":"D" , "agile" : "A" ,"magic":"C", "lucky":"E" , "treasure": "B"},
                    "treasures" : [{ "name":"Zabaniya" , "cnName":"妄想幻象" , "level":"B+" , "type":"对人宝具" , "limit": null, "catch":1}]
                },


                {"rank": "Lancer" , "name":"Diarmuid Ua Duibhne" , "cnName" :"迪卢木多·奥迪那" ,"cv":"神奈延年", "height" : 184 , "weight":85 , "remark":"“举世无双”的爱尔兰费奥纳骑士团首席勇士——“光辉之貌”迪卢木多·奥迪那",
                    "ability": { "strength": "B" , "durablity":"C" , "agile" : "A+" ,"magic":"D", "lucky":"E" , "treasure": "B"},
                    "treasures" : [ 
                        {"name" :"Gae Dearg", "cnName" : "破魔的红蔷薇" ,  "level" : "B" , "type": "对人宝具", "limit": "2~4","catch": 1},
                        {"name" :"Gae Buidhe", "cnName" : "必灭的黄蔷薇" ,  "level" : "B+" , "type": "对人宝具", "limit": "2~3","catch": 1}
                    ]
                },
                {"rank": "Rider" , "name":"Iskandar" , "cnName" :"伊斯坎达尔" ,"cv":"大冢明夫", "height" : 212 , "weight":130, "remark":"",
                    "ability": { "strength": "B" , "durablity":"A" , "agile" : "C" ,"magic":"D", "lucky":"A+" , "treasure": "A++"},
                    "treasures" : [ 
                        {"name" :"Via Expugnatio", "cnName" : "遥远的蹂躏制霸" ,  "level" : "A+" , "type": "对军宝具", "limit": "2~50","catch": 100},
                        {"name" :"Ionioi Hetairoi", "cnName" : "王之军势" ,  "level" : "EX" , "type": "对人宝具", "limit": "1~99","catch": 5000},
                        {"name" :"Blood Fort Andromedan", "cnName" : "他者封印·鲜血神殿" ,  "level" : "B" , "type": "对军宝具", "limit": "10~40","catch": 500}
                    ]
                },
                {"rank": "Caster" , "name":"Gilles de Rais" , "cnName" :"吉尔斯·德·莱斯" ,"cv":"鹤冈聪", "height" : 196 , "weight":70, "remark":"英法百年战争时的法国元帅吉尔·德·雷，生前曾是百战百胜的军事指挥官，但身为军人厉害的并不是自身武力而是财力",
                    "ability": { "strength": "D" , "durablity":"E" , "agile" : "D" ,"magic":"C", "lucky":"E" , "treasure": "A+"},
                    "treasures" : [ 
                        {"name" :"Prelati's Spellbook", "cnName" : "螺湮城教本" ,  "level" : "A+" , "type": "对军宝具", "limit": "1~10","catch": 100}
                    ]
                },
                {"rank": "Berserker" , "name":"Lancelot" , "cnName" :"兰斯洛特" ,"cv":"置鮎龙太郎", "height" : 191 , "weight":81, "remark":"真实身份为古不列颠传说中被称为“湖上骑士”的最强圆桌骑士",
                    "ability": { "strength": "A" , "durablity":"A" , "agile" : "A+" ,"magic":"C", "lucky":"B" , "treasure": "A"},
                    "treasures" : [ 
                        {"name" :"Aroundight", "cnName" : "无毁的湖光" ,  "level" : "A++" , "type": "对人宝具", "limit": "1~2","catch": 1},
                        {"name" :"Knight of Owner", "cnName" : "骑士不徒手而亡" ,  "level" : "A++" , "type": "对人宝具", "limit": "1","catch": 30},
                        {"name" :"For Someone's Glory", "cnName" : "不为一己之荣光" ,  "level" : "B" , "type": "对人宝具", "limit": "0","catch": 1}
                    ]
                }
                
            ]
        }
    ]
}

var classroom = {
    "name" : "Classroom of the Elite",
    "cnName" : "欢迎来到实力至上主义的教室",
    "jpName" : "ようこそ実力至上主義の教室へ",
    "about" : "几乎百分之百实现升学与就业的全国首屈一指的名校──高度育成高中。这间学校使用了最先进的设备，而且每个月还会给予学生价值10万日元的点数，也允许自由选择发型和携带私人物品。简直就是一个乐园般的学校。 \n然而其真面目却是——\n唯有优秀者才能享受优待的实力至上主义学校。因为某些理由而在入学考试中故意放水后，主人公·绫小路清隆被分配到聚集了问题学生的最底层班级·D班，在那里，他遇见了成绩优异但性格却有大问题的美少女·堀北铃音，以及由体贴与温柔所构成的天使般的少女·栉田桔梗。与她们的相遇，使清隆的态度逐渐产生改变。",
    "classrooms" :[{
        "name" :"A",
        "students" : [
            { "name":"Arisu Sakayanagi" , "cnName":"坂柳有栖" , "cv" : "日高里菜" , "age":16 ,"gender" : 2,"birthday":"3.12" , "height" : 150 , "BWH":"B70 W54 H77" ,
            "abilities":{ "learn" : "A" , "intel" : "A" , "judgement" : "A" , "sport": "E-" , "coop": "C+" }},
            { "name":"Kōhei Katsuragi" , "cnName":"葛城康平" , "cv" : "日野聪" , "age": null ,"gender" : 1,"birthday":"8.29" , "height" : 180 , 
            "abilities":{ "learn" : "A" , "intel" : "A" , "judgement" : "B" , "sport": "C" , "coop": "B-" } , "firends":[ "户冢弥彦","绫小路清隆"]}
        ]
    },{
        "name": "B",
        "students":[
             { "name":"Ichinose Honami" , "cnName":"一之濑帆波" , "cv" : "东山奈央" , "age":16 ,"gender" : 2,"birthday":"7.20" , "height" : 159 , "BWH":"B95 W61 H91" ,
            "abilities":{ "learn" : "B+" , "intel" : "A" , "judgement" : "B" , "sport": "C" , "coop": "A-" }},
             { "name":"神崎隆二" , "cnName":"神崎隆二" , "cv" : null , "age": null ,"gender" : 2,"birthday": null , "height" : null  ,
            "abilities":{ "learn" : null , "intel" : null , "judgement" : null , "sport": null, "coop": null }}
        ]
    },{
        "name": "C",
        "students":[
             { "name":"Ibuki Mio" , "cnName":"伊吹澪" , "cv" : "小松未可子" , "age":16 ,"gender" : 2,"birthday":"7.27" , "height" : 159 , "BWH":"B73 W54 H78" ,
            "abilities":{ "learn" : "C" , "intel" : "C" , "judgement" : "B-" , "sport": "B" , "coop": "E" }},
             { "name":"Kakeru Ryūen" , "cnName":"龙园翔" , "cv" : "水中雅章" , "age":16 ,"gender" : 1,"birthday":"10.20" , "height" : 183 ,
            "abilities":{ "learn" : "D" , "intel" : "B" , "judgement" : "A" , "sport": "B" , "coop": "E-" }},
             { "name":"Shiina Hiyori" , "cnName":"椎名日和" , "cv" : null , "age":16 ,"gender" :2,"birthday":"1.21" , "height" : null , "BWH": null ,
            "abilities":{ "learn" : "A-" , "intel" : "A-" , "judgement" : "E" , "sport": "E" , "coop": "D" }}
        ]
    },{
        "name": "D",
        "students":[
             { "name":"Kiyotaka Ayanokouji" , "cnName":"绫小路清隆" , "cv" : "千叶翔也" , "age":16 ,"gender" : 1,"birthday":"10.20" , "height" : 176 , 
            "abilities":{ "learn" : "C" , "intel" : "C-" , "judgement" : "C-" , "sport": "C-" , "coop": "D" }},
             { "name":"Horikita Suzune" , "cnName":"堀北铃音" , "cv" : "鬼头明里" , "age":16 ,"gender" : 2,"birthday":"2.15" , "height" : 156 , "BWH":"B79 W54 H79" ,
            "abilities":{ "learn" : "A" , "intel" : "A-" , "judgement" : "B-" , "sport": "B+" , "coop": "E" }},
             { "name":"Kikyou Kushida" , "cnName":"栉田桔梗" , "cv" : "久保由利香" , "age":16 ,"gender" : 2,"birthday":"1.23" , "height" : 155 , "BWH":"B82 W55 H83" ,
            "abilities":{ "learn" : "B" , "intel" : "B-" , "judgement" : "C+" , "sport": "B" , "coop": "A" }},
            { "name":"Karuizawa Kei" , "cnName":"轻井泽惠" , "cv" : "竹达彩奈" , "age":16 ,"gender" : 2,"birthday":"3.8" , "height" : 154 , "BWH":"B76 W54 H77" ,
            "abilities":{ "learn" : "D-" , "intel" : "D-" , "judgement" : "C-" , "sport": "D" , "coop": "E+" }},
            { "name":"Sakura Airi" , "cnName":"佐仓爱里" , "cv" : "MAO" , "age":16 ,"gender" : 2,"birthday":"10.15" , "height" : 153 , "BWH":"B96 W60 H90" ,
            "abilities":{ "learn" : "C+" , "intel" : "C" , "judgement" : "D" , "sport": "D" , "coop": "D-" }},
            { "name":"Yousuke Hirata" , "cnName":"平田洋介" , "cv" : "逢坂良太" , "age":16 ,"gender" : 1,"birthday":"9.1" , "height" : 174 , 
            "abilities":{ "learn" : "B" , "intel" : "B" , "judgement" : "B+" , "sport": "B" , "coop": "A-" }},
            { "name":"Rokusuke Kouenji" , "cnName":"高圆寺六助" , "cv" : "岩泽俊树" , "age":16 ,"gender" : 1,"birthday":"4.3" , "height" : 181 , 
            "abilities":{ "learn" : "A" , "intel" : "A" , "judgement" : "A" , "sport": "A" , "coop": "E-" }},
            { "name":"Ken Sudou" , "cnName":"须藤健" , "cv" : "竹内荣治" , "age":16 ,"gender" : 1,"birthday":"10.5" , "height" : 183 ,
            "abilities":{ "learn" : "E" , "intel" : "E" , "judgement" : "D+" , "sport": "A" , "coop": "D" }},
            { "name":"Haruka Hasebe" , "cnName":"长谷部波瑠加" , "cv" : "巽悠衣子" , "age":16 ,"gender" : 1,"birthday":"11.5" , "height" : null, "BWH": null,
            "abilities":{ "learn" : "D" , "intel" : "C+" , "judgement" : "C+" , "sport": "D" , "coop": "D" }}
        ]
    }]
}

var openEdit = (dson,json)=>{

    storage.setItem('CodeHere_jsStr',`var DSONJS= require('dson.js')
var d = D = DSON = dson = DSONJS.DSON
exports = function(){
  var v = null
  ${dson}
  return v
}`)
    json = json || simpleJson
    storage.setItem('jsonedit', JSON.stringify(json))
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
            openEdit(`v = dson().get('name') 
  //v = dson('name') 
  //v = dson().get('games[0].name') 
  //v = dson().select('games[0].name') 
  //v = dson().draw('games[0].name') 
  //v = dson().get('games[].name')`)
            break
        case 'find':
            openEdit(`v = dson().find('name')
  v = dson().find(/.*eight/)
  v = dson().find((key,value) =>{ return value &&  value.height && value.height == 167})
  v = dson().find(null,/.*Shirou.*/g)`)
            break
          case 'template':
            openEdit(`v = dson().select({
    hello: 'world',
    name : '\${_d.name}',
    gameName : 'games name is \${_d.games[0].name}'
	})`)
            break
          case 'format':
            openEdit(`v = dson().format({
    	hello :'++\${world}++',
    	name : '\${_d.name}'
		}, { world : "hello hello good day"})`)
            break
          case 'chain':
            openEdit(`v = dson('games').select('[0]').select({
      hello : 'good good day',
      name : '\${_d.name}'
  })`)
            break
          case 'mark':
            openEdit(`v =	dson().get('games[0]').mark('stayNight').get('masters[0]').select({
      name : 'master name is \${_d.name}',
      heigth : '\${_d.height}',
      gameName : '\${stayNight.name}',
      cv : '\${get.cv}'
  })`)
            break
    }
}