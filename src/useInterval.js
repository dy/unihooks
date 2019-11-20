import useRef from './useRef'
import useEffect from './useEffect'
import useState from './useState'

export default function useInterval (callback, delay, deps) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, deps);
};
