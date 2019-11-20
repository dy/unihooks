import useState from './useState'
import useMemo from './useMemo'
import useEffect from './useEffect'

const isDOMavailable = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default function useSSR (callback, delay) {
  const [inBrowser, setInBrowser] = useState(isDOMavailable);

  useEffect(() => {
    setInBrowser(isDOMavailable);
    return () => {
      setInBrowser(false);
    }
  }, []);

  const useSSRObject = useMemo(() => ({
    isBrowser: inBrowser,
    isServer: !inBrowser,
    canUseWorkers: typeof Worker !== 'undefined',
    canUseEventListeners: inBrowser && !!window.addEventListener,
    canUseViewport: inBrowser && !!window.screen
  }), [inBrowser]);

  return useMemo(() => Object.assign(Object.values(useSSRObject), useSSRObject), [inBrowser]);
};
