// https://github.com/30-seconds/30-seconds-of-react#usenavigatoronline

import useState from './useState'
import useEffect from './useEffect'


export default function useOnLine () {
  const [status, setStatus] = useState(navigator.onLine);

  useEffect(() => {
    const setOnline = () => setStatus(true);
    const setOffline = () => setStatus(false);

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  let result = new Boolean(!!status)
  result[0] = status
  return result;
};
