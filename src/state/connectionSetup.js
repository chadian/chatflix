import update from 'immutability-helper';
export const SET_ROLE_ACTION = 'SET_ROLE_ACTION';
export const RESET_ACTION = 'RESET';
export const SET_CANDIDATE_ACTION = 'SET_CANDIDATE';
export const SET_PING_OFFER_ACTION = 'SET_PING_OFFER';
export const SET_PING_WAS_COPIED_ACTION = 'SET_PING_WAS_COPIED';
export const SET_PONG_OFFER_ACTION = 'SET_PONG_OFFER';
export const CONNECTION_ESTABLISHED_ACTION = 'CONNECTION_ESTABLISHED_ACTION';

const defaultState = {
  isConnectionEstablished: false,
  connectionSetup: {
    role: null,
    candidate: null,
    pingOffer: null,
    wasPingCopied: false,
    pongOffer: null,
  }
};

export function connectionSetupReducer(state, action) {
  state = {
    ...defaultState,
    ...state
  };

  if (action.type === RESET_ACTION) {
    return { ...defaultState };
  }


  if (action.type === SET_ROLE_ACTION) {
    const { role } = action;

    return update(state, {
      connectionSetup: {
        role: { $set: role }
      }
    });
  }

  if (action.type === SET_CANDIDATE_ACTION) {
    const { candidate } = action;

    return update(state, {
      connectionSetup: {
        candidate: { $set: candidate }
      }
    });
  }

  if (action.type === SET_PING_OFFER_ACTION) {
    const { pingOffer } = action;

    return update(state, {
      connectionSetup: {
        pingOffer: { $set: pingOffer }
      }
    });
  }

  if (action.type === SET_PING_WAS_COPIED_ACTION) {
    const { value } = action;

    return update(state, {
      connectionSetup: {
        wasPingCopied: { $set: value }
      }
    });
  }

  if (action.type === SET_PONG_OFFER_ACTION) {
    const { pongOffer } = action;

    return update(state, {
      connectionSetup: {
        pongOffer: { $set: pongOffer }
      }
    });
  }

  if (action.type === CONNECTION_ESTABLISHED_ACTION) {
    return update(state, {
      isConnectionEstablished: { $set: true }
    });
  }

  return state;
}
