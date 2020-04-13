
## design

```js
//check test
d().test({
    yourjson : 'here is your json'
})
d().test((data,context)=>{
    return true
})
d().test(async (data,context)=>{
    return true
})

d().test(JVD())
d().test('jvdExpression') // like  >2
d().test(d().test())
// 嵌套支持
d().test({
    strinExample : '!!&?>1',
    dsonExample : d().test('>2'),
    jvdExample : jvd().$({age : '>60'}).or().$({ age : '<20'}),
    fn : async (data,context)=>{ return true}
})



//select 
d({
    newKey : 'hello'
})

d({
    newKey : 'hello'
}).select()

d().select({
    newKey : 'hello'
})

d({
    key0 : '$',
    'key0.1' : DM(),
    'key0.2' : {
        'key0.3' : '$',
        'key0.2' : '$value0.2'
    },
    key1 : DSON().get({
        hello : 'real good days'
    }),
    $key2 : 'hello 2',
    '${key3}' : 'hello 3',
    key4 : '$value4',
    key5 : '$value5.name',
    key6 : '${value6}',
    key7 : 'abc ${value7.name} zzz',
    key8 : '${mark8}',
    key9 : '${autoMark9}',
    key10 : (autoMatchData,rootData,context)=>{ return '$value11'},
    key11 : async (autoMatchData,rootData,context)=>{ return ['cde']},
})


d([{
        name : '$',
        age : '$'
    }])

// where
//just like test

```

### demo
