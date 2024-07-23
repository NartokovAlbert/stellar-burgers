import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type IIngredientSliceState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
};

const initialState: IIngredientSliceState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: undefined
};

interface FetchIngredientsError {
  message: string;
}

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: FetchIngredientsError }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response: TIngredient[] = await getIngredientsApi();
    return response;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'An unknown error occurred'
    });
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(
        fetchIngredients.rejected,
        (state, action: PayloadAction<FetchIngredientsError | undefined>) => {
          state.isIngredientsLoading = false;
          state.error = action.payload?.message || 'An error occurred';
        }
      )
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isIngredientsLoading = false;
          state.ingredients = action.payload;
        }
      );
  }
});

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isIngredientsLoading;

export const selectIngredientsError = (state: RootState): string | undefined =>
  state.ingredients.error;

export const selectIngredientsByType = (type: string) =>
  createSelector([selectIngredients], (ingredients: TIngredient[]) =>
    ingredients.filter((item) => item.type === type)
  );

export const ingredientsReducer = ingredientsSlice.reducer;
