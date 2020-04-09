
## design

```js
//check test
d().test({
    yourjson : 'here is your json'
})

d().test(JVD())
d().test('jvdExpression') // like  >2
d().test(d().test())
// 嵌套支持
d().test({
    dsonExample : d().test('>2'),
    jvdExample : jvd().$({age : '>60'}).or().$({ age : '<20'})
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
