import { useState, useEffect } from './standard'
import { setMicrotask, clearMicrotask } from 'set-microtask'
import tuple from 'immutable-tuple'
import useInit from './useInit'

export const cache = new Map

export default function useStorage(storage, key, init) {
  // state is cached per-key, since it is returned from hook
  let state, stateId = tuple(storage, key)

  if (cache.has(stateId)) {
    state = cache.get(stateId)
  }
  else {
    cache.set(stateId, state = (...args) => state.set(...args))

    // persistency scheduler
    state.plan = storage.plan || (fn => {
      let id = setMicrotask(fn)
      return () => clearMicrotask(id)
    })
    // changed value comparator
    state.is = storage.is || Object.is

    state.value

    // mitt extract (event emiiter)
    state.subs = {}
    state.on = (e, fn) => (state.subs[e] || (state.subs[e] = [])).push(fn)
    state.off = (e, fn) => state.subs[e].splice(state.subs[e].indexOf(fn) >>> 0, 1)
    state.emit = (e, arg) => state.subs[e] && state.subs[e].slice().map(fn => fn(arg))

    state.get = (key) => {
      if (state.plannedPersist) state.persist()
      return storage.get(key)
    }
    state.set = (newValue) => {
      if (typeof newValue === 'function') newValue = newValue(state.value)

      if (state.is(newValue, state.value)) return

      state.value = newValue
      state.planPersist()
      state.planNotify()

      return state.value
    }

    state.plannedNotify
    state.notifyValue
    state.planNotify = () => {
      // plan update, unless that's going to change back
      if (!state.plannedNotify) {
        state.notifyValue = state.value
        state.plannedNotify = setMicrotask(state.notify)
      }
      else {
        if (state.notifyValue === state.value) {
          clearMicrotask(state.plannedNotify)
          state.notifyValue = null
          state.plannedNotify = null
        }
        else {
          state.notifyValue = state.value
        }
      }
    }
    state.notify = () => {
      state.emit('change', state.notifyValue)
      state.notifyValue = null
      state.plannedNotify = null
    }

    state.plannedPersist
    state.planPersist = () => {
      if (state.plannedPersist) return
      state.plannedPersist = state.plan(state.persist) || true
    }
    state.persist = () => {
      storage.set(key, state.value)
      state.plannedPersist = null
    }
    state.valueOf = () => state.value
    state[Symbol.iterator] = function* () { yield state.value; yield state; }
  }


  const [value, setInstanceValue] = useState(() => {
    // state.value can be unsynced from storage
    // eg. not all storages have `change` notifications: globalCache, cookies etc.
    // so we have to read `state.value` from store
    state.value = state.get(key)

    state.set(typeof init === 'function' || (state.value == null && init != state.value) ? init : state.value)

    return state.value
  })

  useInit(() => {
    const notify = value => {
      setInstanceValue(value)
    }
    state.on('change', notify)
    return () => {
      state.off('change', notify)
    }
  })

  return state
}
