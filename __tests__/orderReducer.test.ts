import {
  orderReducer,
  fetchOrderBurgerApi,
  clearOrder,
  selectOrder,
  selectOrderIsLoading
} from '../src/services/slices/orderReducer';
import { order as mockOrder } from '../src/mock';

describe('orderSlice', () => {
  const initialState = {
    order: null,
    orderIsLoading: false,
    error: undefined
  };

  it('Обрабатывает начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Обрабатывает fetchOrderBurgerApi.pending', () => {
    const action = { type: fetchOrderBurgerApi.pending.type };
    const expectedState = {
      ...initialState,
      orderIsLoading: true
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  it('Обрабатывает fetchOrderBurgerApi.fulfilled', () => {
    const action = {
      type: fetchOrderBurgerApi.fulfilled.type,
      payload: mockOrder
    };
    const expectedState = {
      ...initialState,
      orderIsLoading: false,
      order: mockOrder
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  it('Обрабатывает fetchOrderBurgerApi.rejected', () => {
    const error = 'Test Error';
    const action = {
      type: fetchOrderBurgerApi.rejected.type,
      payload: error
    };
    const expectedState = {
      ...initialState,
      orderIsLoading: false,
      error: error
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  it('Обрабатывает clearOrder', () => {
    const action = clearOrder();
    const expectedState = {
      ...initialState,
      order: null,
      orderIsLoading: false,
      error: undefined
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  it('selectOrder возвращает заказ', () => {
    const state = {
      // Предоставляем имитацию всего состояния Redux
      auth: {} as any,
      burgerConstructor: {} as any,
      ingredients: {} as any,
      order: {
        order: mockOrder, // Срез заказа
        orderIsLoading: false, // Добавляем недостающее свойство
        error: undefined // Добавляем недостающее свойство
      },
      feed: {} as any,
      userOrders: {} as any,
      orderByNumber: {} as any
    };
    expect(selectOrder(state)).toEqual(mockOrder);
  });

  it('selectOrderIsLoading возвращает orderIsLoading', () => {
    const state = {
      // Снова имитируем полное состояние Redux
      auth: {} as any,
      burgerConstructor: {} as any,
      ingredients: {} as any,
      order: {
        order: null, // Добавляем недостающее свойство
        orderIsLoading: true, // Срез заказа
        error: undefined // Добавляем недостающее свойство
      },
      feed: {} as any,
      userOrders: {} as any,
      orderByNumber: {} as any
    };
    expect(selectOrderIsLoading(state)).toEqual(true);
  });
});
