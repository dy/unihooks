import { get, set } from 'cookie-cutter'
import useStorage from './useStorage'

const cookieStore = {
  get,
  set(key, value) {
    let options
    if (value && value.value) value = value.value
    options = value
    return set(key, value, options)
  }
}

const useCookie = (key, init) => {
  let [value, store] = useStorage(cookieStore, key, init)
  return [value, store]
}

export default useCookie
