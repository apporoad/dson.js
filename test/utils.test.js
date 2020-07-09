var lutils = require('../utils')


var it2 = global.debug || it


it('test utils', () => {
    var array1 = {
        a: [{
            b: [
                {
                    c: [
                        {}, {}
                    ]
                }
            ]
        }]
    }

    expect(lutils.isArrayUnique('a[0]', array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b', array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b[0]', array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b[0].c', array1)).toBe(false)
    expect(lutils.isArrayUnique('a', array1)).toBe(false)

})


it2('test  has needs', () => {
    expect(lutils.hasNeeds('')).toBe(false)
    expect(lutils.hasNeeds('$...')).toBe(true)
    expect(lutils.hasNeeds('$')).toBe(false)
    expect(lutils.hasNeeds('$abc[]_')).toBe(true)
    expect(lutils.hasNeeds('aa$aa')).toBe(false)
    expect(lutils.hasNeeds('$ccc[0].......')).toBe(true)
    expect(lutils.hasNeeds('cc${aasdf...__[0]}')).toBe(true)
    expect(lutils.hasNeeds('asdfsdf${sfsdfdsfs')).toBe(false)

    var context = {
        abc : { hello : 'world'},
        array : [ { hello :1}],
        b: 'b'
    }

    expect(lutils.fillNeeds('$undefined',context)).toBe(undefined)
    expect(lutils.fillNeeds('$abc',context).hello).toBe('world')
    expect(lutils.fillNeeds('${abc}',context).hello).toBe('world')
    expect(lutils.fillNeeds('${abc.hello}',context)).toBe('world')

    expect(lutils.fillNeeds('$......asdfsf[0]',context)).toBe(null)
    expect(lutils.fillNeeds('${array[0].hello}',context)).toBe(1)

    expect(lutils.fillNeeds('1$2',context)).toBe('1$2')
    expect(lutils.fillNeeds('a${b}a${array[0].hello}a',context)).toBe('aba1a')

    expect(lutils.fillNeeds('a${c.sdfdsf}c',context)).toBe('anullc')
})