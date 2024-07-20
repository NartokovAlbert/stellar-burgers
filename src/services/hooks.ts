import { ActionCreatorsMapObject, AsyncThunk, bindActionCreators, createAsyncThunk as createAsyncThunkRedux } from '@reduxjs/toolkit';
import {
	TypedUseSelectorHook,
	useDispatch as useDispatchRedux,
	useSelector as useSelectorRedux,
} from 'react-redux';

import { useMemo } from 'react';
import { AppDispatch, RootState } from './store';



export const useDispatch = () => useDispatchRedux<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux;


export const useActionCreators = <Actions extends ActionCreatorsMapObject>(actions: Actions): BoundActions<Actions> => {
	const dispatch = useDispatch();

	return useMemo(() => bindActionCreators(actions, dispatch), []);
};

type BoundActions<Actions extends ActionCreatorsMapObject> = {
	[key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any> ? BoundAsyncThunk<Actions[key]> : Actions[key];
};

type BoundAsyncThunk<Thunk extends AsyncThunk<any, any, any>> = (...args: Parameters<Thunk>) => ReturnType<ReturnType<Thunk>>
