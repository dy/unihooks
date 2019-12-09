import useStorage from './useStorage'
import useInit from './useInit'
import store from 'store'
import events from 'store/plugins/events'
import { BroadcastChannel } from 'broadcast-channel'


export const PREFIX = '!uhx::'
export const INTERVAL = 150

store.addPlugin(events)
export { store }

// tmp non-persisted storage
const tmp = {}

export const storage = {
  get(key) {
    if (key in tmp) return tmp[key]
    tmp[key] = store.get(key)
    return tmp[key]
  },
  set(key, value) {
    if (value == null) {
      store.remove(key)
      delete tmp[key]
    }
    else tmp[key] = value
    persist(key, value)
    if (channels[key]) channels[key].postMessage(value)
  },
}

const debounce = (func, delay = 100) => {
  let timer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}
const persist = debounce((key, value) => {
  if (value == null) store.remove(key)
  else store.set(key, value)

  tmp[key] = store.get(key)
}, INTERVAL)



export const channels = {}

export default (key, init) => {
  key = PREFIX + key

  let [value, state] = useStorage(storage, key, init)

  useInit(() => {
    const channel = channels[key] || (channels[key] = new BroadcastChannel(key))
    const notify = (value, ...args) => {
      return state.update(value)
    }
    channel.addEventListener('message', notify)

    const id = store.watch(key, notify)
    return () => {
      store.unwatch(id)
      channel.removeEventListener('message', notify)
      channel.close()
    }
  })


  return [value, state]
}

export const createStore = (key, init) => {
  key = PREFIX + key
  storage.set(key, init)

  return storage.get(key)
}

