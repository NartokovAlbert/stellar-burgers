import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Типизация состояния слайса
interface FeedSliceState {
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: FeedSliceState = {
  userOrders: [],
  userOrdersIsLoading: false,
  error: null
};

// функция для получения заказов
export const fetchUserOrdersApi = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetchUserOrdersApi', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Error fetching orders');
  }
});

//  слайс для заказов
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersApi.pending, (state) => {
        state.userOrdersIsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrdersApi.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.userOrdersIsLoading = false;
          state.error = action.payload || 'Unknown error';
        }
      )
      .addCase(
        fetchUserOrdersApi.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersIsLoading = false;
          state.userOrders = action.payload;
        }
      );
  }
});

// Редюсер
export const userOrdersReducer = userOrdersSlice.reducer;

// Селекторы
export const selectUserOrdersIsLoading = (state: RootState) =>
  state.userOrders.userOrdersIsLoading;

export const selectUserOrders = (state: RootState) =>
  state.userOrders.userOrders;

export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;
