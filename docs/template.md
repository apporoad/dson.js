
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

// where

```

### demo
