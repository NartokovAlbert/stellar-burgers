import {
  burgerConstructorReducer,
  addIngredients,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor,
} from '../src/services/slices/constructorReducer';
import { ingredients } from '../src/mock';
import { TConstructorIngredient } from '../src/utils/types';

const testIngredient: TConstructorIngredient = {
  id: 'testId',
  _id: 'testId',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'testImage',
  image_mobile: 'testImageMobile',
  image_large: 'testImageLarge',
};

describe('Тесты для burgerConstructorReducer', () => {
  it('Возвращает начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      isIngredientsLoading: false,
      error: null
    });
  });

  it('Добавляет ингредиент в конструктор', () => {
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[0]));
    expect(state.constructorItems.bun).toEqual({
      ...ingredients[0],
      id: expect.any(String)
    });

    state = burgerConstructorReducer(state, addIngredients(ingredients[2]));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...ingredients[2],
      id: expect.any(String)
    });
  });

  it('Перемещает ингредиент вверх', () => {
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[2]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[3]));
    state = burgerConstructorReducer(state, addIngredients(testIngredient));

    const ingredient1Id = state.constructorItems.ingredients[0].id;
    const ingredient2Id = state.constructorItems.ingredients[1].id;
    const ingredient3Id = state.constructorItems.ingredients[2].id;

    state = burgerConstructorReducer(state, moveIngredientUp(2));

    expect(state.constructorItems.ingredients.map(item => item.id)).toEqual([
      ingredient1Id,
      ingredient3Id,
      ingredient2Id,
    ]);
  });

  it('Перемещает ингредиент вниз', () => {
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[2]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[3]));
    state = burgerConstructorReducer(state, addIngredients(testIngredient));

    const ingredient1Id = state.constructorItems.ingredients[0].id;
    const ingredient2Id = state.constructorItems.ingredients[1].id;
    const ingredient3Id = state.constructorItems.ingredients[2].id;

    state = burgerConstructorReducer(state, moveIngredientDown(1));

    expect(state.constructorItems.ingredients.map(item => item.id)).toEqual([
      ingredient1Id,
      ingredient3Id,
      ingredient2Id,
    ]);
  });

  it('Удаляет ингредиент', () => {
    let state = burgerConstructorReducer(undefined, addIngredients(testIngredient));

    const addedIngredientId = state.constructorItems.ingredients[0].id;

    state = burgerConstructorReducer(state, removeIngredient(addedIngredientId));

    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('Очищает конструктор', () => {
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[0]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[2]));

    state = burgerConstructorReducer(state, clearConstructor());

    expect(state.constructorItems.bun).toEqual(null);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });
});
