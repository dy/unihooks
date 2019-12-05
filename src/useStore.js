// inspired by https://github.com/kwhitley/use-store/blob/master/src/index.js
import useStorage from './useStorage'
import useInit from './useInit'

const PREFIX = '!uh::'

const storage = {
  get: key => {
    let str = ls.get(key)
    let result = JSON.parse(str)
    return result
  },
  set: ls.set
}

// https://stackoverflow.com/a/2117523/11599918
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function useStore (key, init, options) {
  useInit(() => {
    // it is possible instead to observe localStorage property
    const notify = value => store.update(value)
    ls.on(key, notify)
    return () => ls.off(key, notify)
  })

  let [value, store] = useStorage(storage, key, init)
  return [value, store]
}
