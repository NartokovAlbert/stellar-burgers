import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RequestStatus } from './ingredientsSlice';
import { RootState } from '../store';

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const ordersInfoDataSelector =
  (number: string) => (state: RootState) => {
    if (state.orders.orders.length) {
      const data = state.orders.orders.find((item) => item.number === +number);
      if (data) return data;
    }
    if (state.feed.orders.length) {
      const data = state.feed.orders.find((item) => item.number === +number);
      if (data) return data;
    }
    if (state.order.info?.order.number === +number) {
      return state.order.info.order;
    }
  };

export const orderBurger = createAsyncThunk(
  'order/create',
  async (id_array: string[]) => {
    const data = await orderBurgerApi(id_array);
    return data;
  }
);
export type infoState = {
  order: TOrder;
  name: string;
};

interface TOrderState {
  info: infoState | null;
  isNewOrderLoading: boolean;
  isOrderByNumberLoading: boolean;
  ordersByNumber: TOrder | null;
}

const initialState: TOrderState = {
  info: null,
  isNewOrderLoading: false,
  isOrderByNumberLoading: false,
  ordersByNumber: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetCreateOrder: (state) => {
      state.info = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isNewOrderLoading = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.info = action.payload;
        state.isNewOrderLoading = false;
      })
      .addCase(orderBurger.rejected, (state, { error }) => {
        state.isNewOrderLoading = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderByNumberLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
        state.isOrderByNumberLoading = false;
        state.ordersByNumber = payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.isOrderByNumberLoading = false;
      });
  }
});

export const orderActions = { ...orderSlice.actions };
