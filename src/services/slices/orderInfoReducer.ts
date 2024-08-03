import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Типизация состояния заказа по номеру
type TOrderByNumberSliceState = {
  orders: TOrder[];
  orderIsLoading: boolean;
  error?: string;
};

// Начальное состояние
const initialState: TOrderByNumberSliceState = {
  orders: [],
  orderIsLoading: false,
  error: undefined
};

// Асинхронная функция для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk<
  TOrder[],
  number,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'getOrderByNumber/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);

      if (response.orders) {
        return response.orders;
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      // Приведение типа error к unknown и проверка на экземпляр Error
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An error occurred while fetching the order');
    }
  }
);

// Создание слайса для заказов по номеру
const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderIsLoading = true;
        state.error = undefined;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.orders = action.payload;
      });
  }
});

// Селекторы
export const selectOrdersIsLoading = createSelector(
  (state: RootState) => state.orderByNumber,
  (orderByNumber) => orderByNumber.orderIsLoading
);

export const selectOrders = createSelector(
  (state: RootState) => state.orderByNumber,
  (orderByNumber) => orderByNumber.orders
);

export const selectOrderError = createSelector(
  (state: RootState) => state.orderByNumber,
  (orderByNumber) => orderByNumber.error
);

export const orderByNumberReducer = orderByNumberSlice.reducer;
