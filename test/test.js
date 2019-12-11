import setHooks from 'any-hooks'

// any-hooks by default
// setHooks('augmentor')
setHooks('preact')
// setHooks('react')
runTests()

async function runTests() {
  require('./useStore')
  require('./useLocalStorage')
  require('./useProperty')
  require('./useState')
  require('./useEffect')
  require('./useSyncEffect')
  require('./useGlobalCache')
  require('./useQueryParam')
  require('./useStorage')
  require('./useCookie')
  require('./useInit')
  require('./useAction')
  require('./usePrevious')
  require('./useCountdown')
  require('./useThrottle')
  require('./useAttribute')
}

