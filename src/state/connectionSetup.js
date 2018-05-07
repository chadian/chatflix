export const SET_ROLE_ACTION = 'SET_ROLE_ACTION';

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

  return state;
}
