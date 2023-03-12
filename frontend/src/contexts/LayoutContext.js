import { createContext, useContext, useReducer } from 'react';

const LayoutStateContext = createContext();
const LayoutDispatchContext = createContext();

const initialState = {
  isShowSigninModal: false,
  isShowSignupModal: false,
  isAuth: false,
};

function layoutReducer(state, action) {
  switch (action.type) {
    case 'HIDE_SIGNIN_MODAL':
      return {
        ...state,
        isShowSigninModal: false,
      };
    case 'HIDE_SIGNUP_MODAL':
      return {
        ...state,
        isShowSignupModal: false,
      };
    case 'SHOW_SIGNUP':
      return {
        ...state,
        isShowSignupModal: true,
        isShowSigninModal: false,
      };
    case 'SHOW_SIGNIN':
      return {
        ...state,
        isShowSignupModal: false,
        isShowSigninModal: true,
      };
    case 'LOGGED_IN':
      return {
        ...state,
        isAuth: true,
      };
    case 'LOGGED_OUT':
      return {
        ...state,
        isAuth: false,
      };
    default:
      return state;
  }
}


function LayoutProvider({ children }) {
  const [state, dispatch] = useReducer(layoutReducer, initialState);
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState() {
  const context = useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error('useLayoutState must be used within a LayoutProvider');
  }
  return context;
}

function useLayoutDispatch() {
  const context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error('useLayoutState must be used within a LayoutProvider');
  }
  return context;
}

export {
  LayoutProvider,
  useLayoutState,
  useLayoutDispatch,
};
