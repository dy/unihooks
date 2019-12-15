import setHooks from 'any-hooks'

// any-hooks by default
// setHooks('augmentor')
setHooks('preact')
// setHooks('react')
// setHooks('haunted')
// setHooks('atomico')
runTests()

async function runTests() {
  require('./useAction')
  require('./useStorage')
  require('./useGlobalCache')
  require('./useLocalStorage')
  require('./useStore')
  require('./useProperty')
  require('./useState')
  require('./useEffect')
  require('./useSyncEffect')
  require('./useQueryParam')
  require('./useCookie')
  require('./useInit')
  require('./usePrevious')
  require('./useCountdown')
  require('./useThrottle')
  require('./useAttribute')
}

