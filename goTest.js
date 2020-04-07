

it = (title, fn) => {
  // if (fn)
  //   fn()
}
expect = () => {
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