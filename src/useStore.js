import useStorage from './useStorage'
import useInit from './useInit'
import store from 'store'
import events from 'store/plugins/events'
import { BroadcastChannel } from 'broadcast-channel'


export const PREFIX = '!uhx::'
export const INTERVAL = 150

store.addPlugin(events)
export { store }

export const storage = {
  get(key) {
    return store.get(key)
  },
  set(key, value) {
    if (value == null) {
      store.remove(key)
    }
    else store.set(key, value)
    if (channels[key]) channels[key].postMessage(value)
  },
  plan(fn) {
    let id = setInterval(fn, INTERVAL);
    return clearInterval(id)
  }
}

export const channels = {}

export default (key, init) => {
  key = PREFIX + key

  let [value, state] = useStorage(storage, key, init)

  useInit(() => {
    const channel = channels[key] || (channels[key] = new BroadcastChannel(key))
    const notify = (value, ...args) => {
      return state.set(value)
    }
    channel.addEventListener('message', notify)

    const id = store.watch(key, notify)
    return () => {
      store.unwatch(id)
      channel.removeEventListener('message', notify)
      channel.close()
    }
  })

  return state
}

export const createStore = (key, init) => {
  key = PREFIX + key

  if (storage.get(key) === undefined) {
    storage.set(key, init)
  }

  return storage.get(key)
}

