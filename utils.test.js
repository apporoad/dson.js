var lutils = require('./utils')


var it2 = global.debug || it


it2('test utils', () => {
    var array1 = {
        a: [{
            b: [
                {c: [
                    {},{}
                ] }
            ]
        }]
    }

    expect(lutils.isArrayUnique('a[0]',array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b',array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b[0]',array1)).toBe(true)
    expect(lutils.isArrayUnique('a[0].b[0].c',array1)).toBe(false)
    
    expect(lutils.isArrayUnique('a',array1)).toBe(false)

})