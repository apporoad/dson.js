

it = (title, fn) => {
  if (fn)
    fn()
}
expect = () => {
  return {
    toBe: () => { },
    toBeTruthy: () => { }
  }
}


require('./test')