import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { constructorSlice } from './slices/constructorSlice';
import { feedSlice } from './slices/feedSlice';
import { ordersSlice } from './slices/ordersSlice';
import { orderSlice } from './slices/orderSlice';

const rootReducer = {
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [orderSlice.name]: orderSlice.reducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
