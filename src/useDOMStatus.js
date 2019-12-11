// credit of https://github.com/21kb/react-hooks/blob/master/packages/react-dom-status-hook/src/index.ts
import { useEffect, useState } from './standard'


export const initialState = {
  readyState: document.readyState,
};

const useDOMState = () => {
  const [state, setState] = useState(initialState);

  const handleDOM = () => {
    // document.readyState is a read-only property AFAICT.
    // Therefore, `setReadyState` has no effect on
    // `document.readyState`. Doing this just to make TS
    // happy.
    setState({ readyState: document.readyState });
  };

  useEffect(() => {
    document.addEventListener('DOMContentLoaded', handleDOM);
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOM);
    };
  }, []);

  return state;
};

export default useDOMState;
