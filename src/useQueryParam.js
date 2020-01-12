import useSource from './useSource'
import qs from 'qs'
import autoParse from 'auto-parse'
import sorted from 'sorted-object'
import { useEffect, } from './standard'
import { wrapHistory, navigateEvent } from './util'

wrapHistory('push')
wrapHistory('replace')
navigateEvent()


const storage = {
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
    let search = window.location.search.slice(1)
    let params = qs.parse(search)

    // primitive
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

    planPersist(name, value)
  }
}

// batch-update
let plannedParams = {}, plannedTimeout
function planPersist (name, value) {
  plannedParams[name] = value

  if (!plannedTimeout) {
    Promise.resolve().then(() => {
      let search = window.location.search.slice(1)
      let params = qs.parse(search)
      Object.assign(params, plannedParams)

      params = sorted(params)
      let str = qs.stringify(params, { encode: false })

      // ignore unchanged transition
      if (str === search) return

      window.history.replaceState(null, '', str ? '?' + str : window.location.href.split('?')[0])
      plannedTimeout = null
      plannedParams = {}
    })
  }
}


export default function useQueryParam(name, init) {
  useEffect(() => {
    const notify = () => {
      store.set(storage.get(name))
    }
    window.addEventListener('popstate', notify)
    window.addEventListener('pushstate', notify)
    window.addEventListener('replacestate', notify)
    window.addEventListener('navigate', notify)
    return () => {
      window.removeEventListener('popstate', notify)
      window.removeEventListener('pushstate', notify)
      window.removeEventListener('replacestate', notify)
      window.removeEventListener('navigate', notify)
    }
  }, [])
  let [value, store] = useSource(storage, name, init)
  return [value, store]
}

function stringifyParam(value) {
  let str = qs.stringify({ u: value }, { encode: false })
  if (str[1] === '=') str = str.slice(2)
  return str
}
