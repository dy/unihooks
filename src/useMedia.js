import matchMedia from 'matchmediaquery'
import hyphenate from 'hyphenate-style-name'
import areObjectsEqual from 'shallow-equal/objects'
import toQuery from './toQuery'
import Context from './Context'
import { useEffect, useState, useRef, useContext } from './util/hooks'


const makeQuery = (settings) => settings.query || toQuery(settings)

const hyphenateKeys = (obj) => {
  if (!obj) return null
  const keys = Object.keys(obj)
  if (keys.length === 0) return null
  return keys.reduce((result, key) => {
    result[hyphenate(key)] = obj[key]
    return result
  }, {})
}

const useIsUpdate = () => {
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true
  }, [])

  return ref.current
}

const useDevice = (deviceFromProps) => {
  const deviceFromContext = useContext(Context)
  const getDevice = () =>
    hyphenateKeys(deviceFromProps) || hyphenateKeys(deviceFromContext)
  const [device, setDevice] = useState(getDevice)

  useEffect(() => {
    const newDevice = getDevice()
    if (!areObjectsEqual(device, newDevice)) {
      setDevice(newDevice)
    }
  }, [deviceFromProps, deviceFromContext])

  return device
}

const useQuery = (settings) => {
  const getQuery = () => makeQuery(settings)
  const [query, setQuery] = useState(getQuery)

  useEffect(() => {
    const newQuery = getQuery()
    if (query !== newQuery) {
      setQuery(newQuery)
    }
  }, [settings])

  return query
}

const useMatchMedia = (query, device) => {
  const getMatchMedia = () => matchMedia(query, device || {}, !!device)
  const [mq, setMq] = useState(getMatchMedia)
  const isUpdate = useIsUpdate()

  useEffect(() => {
    if (isUpdate) {
      // skip on mounting, it has already been set
      setMq(getMatchMedia())
    }

    return () => {
      mq.dispose()
    }
  }, [query, device])

  return mq
}

const useMatches = (mediaQuery) => {
  const [matches, setMatches] = useState(mediaQuery.matches)

  useEffect(() => {
    const updateMatches = () => {
      setMatches(mediaQuery.matches)
    }
    mediaQuery.addListener(updateMatches)
    updateMatches()

    return () => {
      mediaQuery.removeListener(updateMatches)
    }
  }, [mediaQuery])

  return matches
}

const useMediaQuery = (settings, device, onChange) => {
  const deviceSettings = useDevice(device)
  const query = useQuery(settings)
  if (!query) throw new Error('Invalid or missing MediaQuery!')
  const mq = useMatchMedia(query, deviceSettings)
  const matches = useMatches(mq)
  const isUpdate = useIsUpdate()

  useEffect(() => {
    if (isUpdate && onChange) {
      onChange(matches)
    }
  }, [matches])

  return matches
}

export default useMediaQuery
