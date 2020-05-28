

it = (title, fn) => {
  // if (fn)
  //   fn()
}
expect = (result) => {
  //console.log(result)
  return {
    toBe: () => { },
    toBeTruthy: () => { }
  }
}

it2 = (title,fn)=>{
  if(fn)
    fn()
}

global.debug = global.debug || it2
require('./test')

require('./utils.test')

require('./bug.test')