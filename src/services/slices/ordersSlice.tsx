import { TOrder } from '@utils-types';
import { RequestStatus } from './ingredientsSlice';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

interface TOrdersState {
  orders: TOrder[];
  status: RequestStatus;
}

const initialState: TOrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const getOrders = createAsyncThunk<TOrder[]>(
  'orders/getOrders',
  getOrdersApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  }
});
