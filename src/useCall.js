import { useState, useEffect, useRef } from './util/hooks'



export const useAsyncCall = (fn, deps) => {
  // indicates both loading flag and arguments for fn
  const [args, set] = useState();
  const self = useRef({
    start: async (...args) => {
      set(args)
      // reset state for the next call
      self.result = null
      self.error = null
      return new Promise((ok, nok) => {
        self.resolve = ok
        self.reject = nok
      })
    },
    result: null,
    error: null,
    resolve: null,
    reject: null
  }).current;

  // reset/init
  useEffect(() => {
    // edge case when start was called before this init and have args run planned
    if (args === undefined) return
    set(null)
  }, deps)

  // trigger whenever started changes
  useEffect(() => {
    if (!args) return

    let result = fn(...args)
    let isValid = true

    // handle sync function / undefined result
    if (!result || !result.then) {
      if (!isValid) return
      self.result = result
      self.resolve(result)
      set(null)
      return
    }

    result.then(result => {
      if (!isValid) return
      self.result = result
      self.resolve(result)
      set(null)
    }, error => {
      if (!isValid) return
      self.error = error
      self.reject(error)
      set(null)
    })

    return () => { isValid = false }
  }, [args])

  return [self.result, self.error, !!args, self.start]
}
