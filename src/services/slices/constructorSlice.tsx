import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addToConstructor: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeFromConstructor: (state, { payload }) => {
      state.ingredients.splice(payload, 1);
    },
    reorderConstructor: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];
      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    resetConstructor: () => initialState
  }
});

export const addToConstructor = constructorSlice.actions.addToConstructor;
export const removeFromConstructor =
  constructorSlice.actions.removeFromConstructor;
export const reorderConstructor = constructorSlice.actions.reorderConstructor;
export const resetConstructor = constructorSlice.actions.resetConstructor;
