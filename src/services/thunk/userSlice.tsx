import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie } from 'src/utils/cookie';
import { RequestStatus } from './ingredientsSlice';
import { checkUserAuth, loginUser, registerUser } from './thunk/user';

type User = {
  name: string;
  email: string;
};

type TUserState = {
  isAuthChecked: boolean;
  user: User | null;
  requestStatus: RequestStatus;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  requestStatus: RequestStatus.Idle
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.user = action.payload.user;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.user = action.payload.user;
      });
  },
  selectors: {
    getUser: (state: TUserState) => state.user,
    getIsAuthChecked: (state: TUserState) => state.isAuthChecked
  }
});

export const userActions = {
  ...userSlice.actions,
  checkUserAuth,
  registerUser,
  loginUser
};
export const userSelectors = userSlice.selectors;
