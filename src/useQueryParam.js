import useStorage from './useSource'
import qs from 'qs'
import autoParse from 'auto-parse'
import sorted from 'sorted-object'
import { useEffect, } from './standard'

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
    window.addEventListener('uhx:pushState', notify)
    window.addEventListener('uhx:replaceState', notify)
    window.addEventListener('uhx:navigate', notify)
    return () => {
      window.removeEventListener('popstate', notify)
      window.removeEventListener('uhx:pushState', notify)
      window.removeEventListener('uhx:replaceState', notify)
      window.removeEventListener('uhx:navigate', notify)
    }
  }, [])
  let [value, store] = useStorage(storage, name, init)
  return [value, store]
}

function stringifyParam(value) {
  let str = qs.stringify({ u: value }, { encode: false })
  if (str[1] === '=') str = str.slice(2)
  return str
}


// sorry for doing this https://stackoverflow.com/a/25673946/1052640
var _wr = function (type) {
  var orig = history[type];
  return function () {
    var rv = orig.apply(this, arguments);
    var e = new Event('uhx:' + type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
};
history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');


// excerpt from https://github.com/WebReflection/onpushstate
document.addEventListener('click', function (e) {
  // find the link node (even if inside an opened Shadow DOM)
  var target = e.target.shadowRoot ? e.path[0] : e.target;
  // find the anchor
  var anchor = target.closest('A')
  if (
    // it was found
    anchor &&
    // it's for the current page
    /^(?:_self)?$/i.test(anchor.target) &&
    // it's not a download
    !anchor.hasAttribute('download') &&
    // it's not a resource handled externally
    anchor.getAttribute('rel') !== 'external' &&
    // it's not a click with ctrl/shift/alt keys pressed
    // => (let the browser do it's job instead)
    !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey &&
    // let empty links be (see issue #5)
    anchor.href
  ) {
    var next = new URL(anchor.href);
    var curr = location;

    // only if in the same origin
    if (next.origin !== curr.origin) return

    var e = new Event('uhx:navigate');
    window.dispatchEvent(e);
  }
}, true);
