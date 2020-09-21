import React, { createContext, useContext, useReducer } from 'react';

import { reducer } from './reducer';
import { initialState } from './initialState';

const createCtx = (reducer, initialState) => {
  const defaultDispatch = () => initialState; // placeholder

  const ctx = createContext({ state: initialState, dispatch: defaultDispatch });

  const Provider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <ctx.Provider value={{ state, dispatch }} {...props} />;
  };

  return [ctx, Provider];
};

const [ctx, Provider] = createCtx(reducer, initialState);

export const StateProvider = props => <Provider>{props.children}</Provider>;

export const useStateValue = () => useContext(ctx);
