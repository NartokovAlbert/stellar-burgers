import { configureStore, EnhancedStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { ingredientsReducer, fetchIngredients } from '../src/services/slices/ingredientReducer';
import { ingredients } from '../src/mock';
import { getIngredientsApi } from '@api';


type RootState = ReturnType<typeof ingredientsReducer>;

type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  let store: EnhancedStore<{ ingredients: RootState }, AnyAction, []>;

  beforeEach(() => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredients);
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
  });

  it('Загружает ингредиенты', async () => {
    await store.dispatch(fetchIngredients() as any);

    const state = store.getState();
    expect(state.ingredients.ingredients).toEqual(ingredients);
    expect(state.ingredients.isIngredientsLoading).toBe(false);
    expect(state.ingredients.error).toBeUndefined();
  });

  it('Обрабатывает состояние загрузки во время получения ингредиентов', async () => {
    const promise = store.dispatch(fetchIngredients() as any);
    expect(store.getState().ingredients.isIngredientsLoading).toBe(true);
    await promise;
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
  });

  it('Обрабатывает ошибку, когда получение ингредиентов завершается сбоем', async () => {
    const error = new Error('error');
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(error);

    await store.dispatch(fetchIngredients() as any);

    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
    expect(store.getState().ingredients.error).toBe(error.message);
  });

  it('Правильно выбирает ингредиенты после получения', async () => {
    await store.dispatch(fetchIngredients() as any);

    const selectedIngredients = store.getState().ingredients.ingredients;
    expect(selectedIngredients).toEqual(ingredients);
  });

  it('Правильно выбирает состояние загрузки', async () => {
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);

    const promise = store.dispatch(fetchIngredients() as any);
    expect(store.getState().ingredients.isIngredientsLoading).toBe(true);

    await promise;
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
  });
});
