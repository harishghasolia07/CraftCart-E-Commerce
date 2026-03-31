import { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export const StoreContext = createContext(new RootStore());

export const useStore = () => useContext(StoreContext);

// Since we are required to use Class Components, we should create an HOC for the Store.
export const withStore = (Component) => (props) => {
  const store = useStore();
  return <Component {...props} store={store} />;
};
