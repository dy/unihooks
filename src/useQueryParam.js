import useStorage from './useStorage'
// import { qs.parse, qs.stringify } from 'qss'
import qs from 'qs'
import autoParse from 'auto-parse'
import sorted from 'sorted-object'

const cache = {}

export default function useQueryParam(name, init) {
  let storage = cache[name]
  if (!storage) {
    let parseOptions = {}
    cache[name] = storage = {
      get: () => {
        let q = qs.parse(window.location.search.slice(1), parseOptions)
        let parsed = autoParse(q[name])
        if (typeof parsed === 'string') {
          let date = Date.parse(parsed)
          if (!isNaN(date)) {
            parsed = new Date(date)
          }
        }

        return parsed
      },
      set: value => {
        let params = qs.parse(window.location.search.slice(1), parseOptions)

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

    window.addEventListener('popstate', () => {
      store.update(storage.get())
    })
  }

  // TODO: notify external history pushes

  let [value, store] = useStorage(storage, init)
  return [value, store]
}

function stringifyParam (value) {
  let str = qs.stringify({ u: value }, {encode: false})
  if (str[1] === '=') str = str.slice(2)
  return str
}
