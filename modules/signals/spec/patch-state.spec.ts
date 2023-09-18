import { patchState, signalState } from '../src';

describe('patchState', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
  };

  it('patches state via partial state object', () => {
    const state = signalState(initialState);

    patchState(state, {
      user: { firstName: 'Johannes', lastName: 'Schmidt' },
      foo: 'baz',
    });

    expect(state()).toEqual({
      ...initialState,
      user: { firstName: 'Johannes', lastName: 'Schmidt' },
      foo: 'baz',
    });
  });

  it('patches state via updater function', () => {
    const state = signalState(initialState);

    patchState(state, (state) => ({
      numbers: [...state.numbers, 4],
      ngrx: 'rocks',
    }));

    expect(state()).toEqual({
      ...initialState,
      numbers: [1, 2, 3, 4],
      ngrx: 'rocks',
    });
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    const state = signalState(initialState);

    patchState(
      state,
      { user: { firstName: 'Johannes', lastName: 'Schmidt' } },
      (state) => ({ numbers: [...state.numbers, 4], foo: 'baz' }),
      (state) => ({ user: { ...state.user, firstName: 'Jovan' } }),
      { foo: 'foo' }
    );

    expect(state()).toEqual({
      ...initialState,
      user: { firstName: 'Jovan', lastName: 'Schmidt' },
      foo: 'foo',
      numbers: [1, 2, 3, 4],
    });
  });

  it('patches state immutably', () => {
    const state = signalState(initialState);

    patchState(state, {
      foo: 'bar',
      numbers: [3, 2, 1],
      ngrx: 'rocks',
    });

    expect(state.user()).toBe(initialState.user);
    expect(state.foo()).toBe(initialState.foo);
    expect(state.numbers()).not.toBe(initialState.numbers);
    expect(state.ngrx()).not.toBe(initialState.ngrx);
  });
});
