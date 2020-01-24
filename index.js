import setHooks, { useEffect, useMemo, useState } from "any-hooks"

export default setHooks

const listeners = globalThis.__uhxListeners || (globalThis.__uhxListeners = {}),
  values = globalThis.__uhxValues || (globalThis.__uhxValues = {})
export function useValue(key, init) {
  let [, update] = useState()

  useMemo(() => {
    if (init === undefined) return
    if (!(key in values)) values[key] = typeof init === 'function' ? init() : init
  }, [key])

  useEffect(() => {
    (listeners[key] || (listeners[key] = [])).push(update)
    return () => {
      listeners[key].splice(listeners[key].indexOf(update) >>> 0, 1)
      if (!listeners[key].length) delete values[key]
    }
  }, [key])

  return [values[key], (value) => {
    values[key] = value
    listeners[key].map(update => update(value))
  }]
}

export function useStorage(key, init, storage = window.localStorage) {
  let [value, setValue] = useValue('__uhx:storage-' + key, init)

  useMemo(() => {
    if (init === undefined) return
    if (storage.getItem(key) === undefined) storage.setItem(key, value)
  }, [key])

  useEffect(() => {
    let update = e => {
      if (e.key !== key) return
      setValue(e.newValue)
    }
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [key])

  return [value, (value) => {
    setValue(value)
    storage.setItem(key, value)
  }]
}

let locationDeps = 0
export function useURLSearchParam(key, init) {
  let [value, setValue] = useValue('__uhx:URLSearchParam-' + key, init)

  useMemo(() => {
    if (init === undefined) return
    let params = new URLSearchParams(window.location.search)
    if (params.get(key) === undefined) {
      params.set(key, value)
      setURLSearchParams(params)
    }
  }, [key])

  useEffect(() => {
    let unwrapPush, unwrapReplace, disableNavigateEvent
    if (!locationDeps) {
      unwrapPush = wrapHistory('push')
      unwrapReplace = wrapHistory('replace')
      disableNavigateEvent = enableNavigateEvent()
    }
    locationDeps++

    const update = (e) => {
      let params = new URLSearchParams(window.location.search)
      let newValue = params.get(key)
      if (newValue !== value) setValue(newValue)
    }

    window.addEventListener('popstate', update)
    window.addEventListener('pushstate', update)
    window.addEventListener('replacestate', update)
    window.addEventListener('navigate', update)

    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('pushstate', update)
      window.removeEventListener('replacestate', update)
      window.removeEventListener('navigate', update)

      locationDeps--
      if (!locationDeps) {
        unwrapPush()
        unwrapReplace()
        disableNavigateEvent()
      }
    }
  }, [key])

  return [value, value => {
    let params = new URLSearchParams(window.location.search)
    params.set(key, value)
    setURLSearchParams(params)
  }]
}
function setURLSearchParams(params) {
  let str = params.toString()
  window.history.replaceState(null, '', str ? '?' + str : window.location.href.split('?')[0])
}
// https://stackoverflow.com/a/25673946/1052640
// https://github.com/lukeed/navaid/blob/master/src/index.js#L80-L90
function wrapHistory(type) {
  type += 'State'
  const fn = history[type]
  history[type] = function (uri) {
    let result = fn.apply(this, arguments)
    let ev = new Event(type.toLowerCase())
    ev.uri = uri
    ev.arguments = arguments
    window.dispatchEvent(ev)
    return result
  }
  return () => {
    history[type] = fn
  }
}
// https://github.com/WebReflection/onpushstate
// https://github.com/lukeed/navaid/blob/master/src/index.js#L52-L60
function enableNavigateEvent() {
  const handleNavigate = (e) => {
    // find the link node (even if inside an opened Shadow DOM)
    var target = e.target.shadowRoot ? e.path[0] : e.target;
    // find the anchor
    var anchor = target.closest('A')

    // if found
    if (!anchor) return

    // it's not a click with ctrl/shift/alt keys pressed
    // => (let the browser do it's job instead)
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.button && !e.defaultPrevented) return

    // it's for the current page
    if (!/^(?:_self)?$/i.test(anchor.target)) return

    // same origin
    if (anchor.host !== location.host) return

    // it's not a download
    if (anchor.hasAttribute('download')) return

    // it's not a resource handled externally
    if (anchor.getAttribute('rel') === 'external') return

    // let empty links be (see issue #5)
    if (!anchor.href) return

    var e = new Event('navigate');
    window.dispatchEvent(e);
  }
  document.addEventListener('click', handleNavigate, true)
  return () => document.removeEventListener('click', handleNavigate)
}

export function useCountdown(n, interval = 1000) {
  const [count, set] = useState(n)

  const reset = useCallback(() => set(n), [n])

  const schedule = useMemo(() => {
    return typeof interval === 'function' ? interval : fn => {
      let id = setInterval(fn, interval)
      return clearInterval(id)
    }
  }, [interval])

  useEffect(() => {
    const unschedule = schedule(() => {
      set(count => {
        if (count <= 0) return (clearInterval(timeoutId), 0)
        else return count - 1
      })
    })

    return unschedule
  }, [n, schedule])

  return [count, reset]
}

export function useFormField(key, init) {
  let [value, setValue] = useValue('__uhx:formField', init)
}
