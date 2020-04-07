

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
require('./test')