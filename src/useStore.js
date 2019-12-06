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

const channels = {}

export default (key, init) => {
  key = PREFIX + key

  let [value, state] = useStorage(storage, key, init)

  useInit(() => {
    const channel = channels[key] || (channels[key] = new BroadcastChannel(key))
    channel.addEventListener('message', value => state.fetch(value))

    const obsId = store.observe(key, value => state.fetch(value))
    return () => store.unobserve(obsId)
  })


  return [value, state]
}
