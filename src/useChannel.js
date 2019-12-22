import { BroadcastChannel } from 'broadcast-channel'

const channels = {}

const store = {
  get(key) {
    if (!channels[key]) {
      const channel = new BroadcastChannel(key)

      channel.onmessage = msg => {
        if (msg === 'init') {
          // make channel initializer
          channel.postMessage(value)
        }
      }
      // init channel by posting init message
      channel.postMessage('init')

      channels[key] = channel
    }
    else {
      return channels[key].value
    }
  },
  set(key, value) {
    return channels[key].value
  },
  plan(fn) { fn() }
}

export default function useChannel (name, init) {

}
