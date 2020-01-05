import useStorage from './useSource'
import useSyncEffect from './useSyncEffect'
import store from 'store'
import events from 'store/plugins/events'
import { BroadcastChannel } from 'broadcast-channel'
import dequal from 'dequal'

export const PREFIX = '!uhx:'
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
    let id = setTimeout(fn, INTERVAL);
    return () => clearTimeout(id)
  },

  // deep equal is required for identifying across tabs
  is: dequal
}

export const channels = {}

export default (key, init) => {
  key = PREFIX + key

  let [value, state] = useStorage(storage, key, init)

  useSyncEffect(() => {
    const channel = channels[key] || (channels[key] = new BroadcastChannel(key))
    const notify = (value, ...args) => {
      return state.set(value)
    }
    channel.addEventListener('message', notify)
    channel.listenersCount = (channel.listenersCount || 0) + 1

    const id = store.watch(key, notify)
    return () => {
      store.unwatch(id)
      channel.removeEventListener('message', notify)
      channel.listenersCount--
      if (!channel.listenersCount) {
        delete channels[key]
        channel.close()
      }
    }
  }, [key])

  return state
}

export const createStore = (key, init) => {
  key = PREFIX + key

  if (storage.get(key) === undefined) {
    storage.set(key, init)
  }

  return storage.get(key)
}

export const setStore = function (key, value) {
  key = PREFIX + key

  if (arguments.length > 1) {
    storage.set(key, value)
  }

  return storage.get(key)
}

export const getStore = function (key) {
  key = PREFIX + key
  return storage.get(key)
}
