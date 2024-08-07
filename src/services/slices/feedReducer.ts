import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedSliceState = {
  feeds: TOrder[];
  feedIsLoading: boolean;
  total: number;
  totalToday: number;
  error: string | undefined;
};

const initialState: TFeedSliceState = {
  feeds: [],
  feedIsLoading: false,
  total: 0,
  totalToday: 0,
  error: undefined
};

type FeedApiResponse =
  | {
      orders: TOrder[];
      total: number;
      totalToday: number;
    }
  | {
      error: string;
    };

export const fetchFeedsApi = createAsyncThunk<
  FeedApiResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeedsApi', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();

    if (
      typeof response === 'object' &&
      'error' in response &&
      typeof response.error === 'string'
    ) {
      return rejectWithValue(response.error);
    }
    if ('orders' in response) {
      return response;
    }

    return rejectWithValue('Invalid API response');
  } catch (error: unknown) {
    if (error instanceof Error && typeof error.message === 'string') {
      return rejectWithValue(error.message);
    }

    return rejectWithValue('ошибка');
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
      .addCase(fetchFeedsApi.rejected, (state, action) => {
        state.feedIsLoading = false;
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchFeedsApi.fulfilled, (state, action) => {
        state.feedIsLoading = false;
        if ('orders' in action.payload) {
          state.feeds = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        } else {
          state.error = action.payload.error;
        }
      });
  }
});

export const selectFeedIsLoading = (state: { feed: TFeedSliceState }) =>
  state.feed.feedIsLoading;
export const selectFeeds = (state: { feed: TFeedSliceState }) =>
  state.feed.feeds;
export const selectTotal = (state: { feed: TFeedSliceState }) =>
  state.feed.total;
export const selectTotalToday = (state: { feed: TFeedSliceState }) =>
  state.feed.totalToday;

export const feedReducer = feedSlice.reducer;
