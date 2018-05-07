export const SET_ROLE_ACTION = 'SET_ROLE_ACTION';
export const RESET = 'RESET';

const defaultState = {
  connectionSetup: {
    role: null,
  }
};

export function connectionSetupReducer(state, action) {
  state = {
    ...defaultState,
    ...state
  };


  if (action.type === SET_ROLE_ACTION) {
    const { role } = action;

    return {
      ...state,
      connectionSetup: { role }
    };
  }

  if (action.type === RESET) {
    console.log(defaultState);
    return { ...defaultState }
  }

  return state;
}
