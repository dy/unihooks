import useStorage from './useStorage'
import useInit from './useInit'
import store from 'store'
import observe from 'store/plugins/observe'
import { BroadcastChannel } from 'broadcast-channel'


export const PREFIX = '!uhx::'
export const INTERVAL = 150

store.addPlugin(observe)
export { store }

export const storage = {
  get: (key) => store.get(key),
  set: (key, value) => {
    if (value == null) store.remove(key)
    else store.set(key, value)
    if (channels[key]) channels[key].postMessage(value)
  },
  plan: (fn) => {
    let id = setTimeout(() => fn(), INTERVAL)
    return () => clearTimeout(id)
  }
}

export const channels = {}

export default (key, init) => {
  key = PREFIX + key

  let [value, state] = useStorage(storage, key, init)

  useInit(() => {
    const channel = channels[key] || (channels[key] = new BroadcastChannel(key))
    const notify = value => state.fetch(value)
    channel.addEventListener('message', notify)

    const obsId = store.observe(key, notify)
    return () => {
      store.unobserve(obsId)
      channel.removeEventListener('message', notify)
      channel.close()
    }
  })


  return [value, state]
}

export const createStore = (key, init) => {
  key = PREFIX + key
  storage.set(key, init)
}

