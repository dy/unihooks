import useStorage from './useStorage'
import qs from 'qs'
import autoParse from 'auto-parse'
import sorted from 'sorted-object'
import { useEffect,  } from './util/hooks'
import 'onpushstate'

const storage = {
  is: (a, b) => stringifyParam(a) === stringifyParam(b),
  get: (name) => {
    let q = qs.parse(window.location.search.slice(1))
    let parsed = autoParse(q[name])
    if (typeof parsed === 'string') {
      let date = Date.parse(parsed)
      if (!isNaN(date)) {
        parsed = new Date(date)
      }
    }

    return parsed
  },
  set: (name, value) => {
    let params = qs.parse(window.location.search.slice(1))

    // ignore unchanged value
    if (typeof value !== 'object') {
      let strValue = stringifyParam(value)
      if (params[name] === strValue) return
      // FIXME: default must be handled with special function
      // if (strValue === stringifyParam(init)) delete params[name]
      params[name] = strValue
    }
    else {
      params[name] = value
    }

    params = sorted(params)
    let str = qs.stringify(params, { encode: false })

    // ignore unchanged transition
    if (str === window.location.search.slice(1)) return

    window.history.replaceState(null, '', str ? '?' + str : window.location.href.split('?')[0])
  }
}

export default function useQueryParam(name, init) {
  useEffect(() => {
    const notify = () => {
      store.update(storage.get(name))
    }
    window.addEventListener('pushstate', notify)
    window.addEventListener('popstate', notify)
    return () => window.removeEventListener('popstate', notify)
  }, [])

  let [value, store] = useStorage(storage, name, init)
  return [value, store]
}

function stringifyParam (value) {
  let str = qs.stringify({ u: value }, {encode: false})
  if (str[1] === '=') str = str.slice(2)
  return str
}
