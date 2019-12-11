// credit https://github.com/21kb/react-hooks/blob/master/packages/react-page-visible-hook/src/index.ts
import { useEffect, useState } from './standard'

export const initialState = {
  hidden: document.hidden,
  visibilityState: document.visibilityState,
};

const useVisible = () => {
  const [state, setState] = useState(initialState);

  const onVisibilityChangeEvent = (event) => {
    setState({
      hidden: document.hidden,
      visibilityState: document.visibilityState,
    });
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChangeEvent);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChangeEvent);
    };
  }, []);

  return state;
};

export default useVisible;
