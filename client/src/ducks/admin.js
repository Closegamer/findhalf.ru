import Immutable from 'seamless-immutable';

const prefix = 'admin';

const ADMIN_ACT = `${prefix}/ADMIN_ACT`;

const initialState = Immutable({
  adminAct: false
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADMIN_ACT:
      return Immutable.merge(state, {
        adminAct: true
      });

    default:
      return state;
  }
}
