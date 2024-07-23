import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedSliceState = {
  feeds: TOrder[];
  feedIsLoading: boolean;
  total: number;
  totalToday: number;
  error?: string | never;
};

const initialState: TFeedSliceState = {
  feeds: [],
  feedIsLoading: false,
  total: 0,
  totalToday: 0,
  error: undefined
};

type FeedApiResponse =
  | { orders: TOrder[]; total: number; totalToday: number }
  | { error: string };

export const fetchFeedsApi = createAsyncThunk<
  FeedApiResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeedsApi', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();

    // Проверка на наличие ошибки в ответе
    if ('error' in response) {
      return rejectWithValue(response.error);
    }

    return response;
  } catch (error) {
    // Приведение типа error к unknown и проверка на экземпляр Error
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Network error');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsApi.pending, (state) => {
        state.feedIsLoading = true;
      })
      .addCase(
        fetchFeedsApi.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.feedIsLoading = false;
          state.error = action.payload || 'An unknown error occurred';
        }
      )
      .addCase(
        fetchFeedsApi.fulfilled,
        (state, action: PayloadAction<FeedApiResponse>) => {
          state.feedIsLoading = false;
          if ('orders' in action.payload) {
            state.feeds = action.payload.orders;
            state.total = action.payload.total;
            state.totalToday = action.payload.totalToday;
          } else {
            state.error = action.payload.error;
          }
        }
      );
  }
});

// Селекторы с улучшенной типизацией
export const selectFeedIsLoading = (state: { feed: TFeedSliceState }) =>
  state.feed.feedIsLoading;
export const selectFeeds = (state: { feed: TFeedSliceState }) =>
  state.feed.feeds;
export const selectTotal = (state: { feed: TFeedSliceState }) =>
  state.feed.total;
export const selectTotalToday = (state: { feed: TFeedSliceState }) =>
  state.feed.totalToday;

export const feedReducer = feedSlice.reducer;
