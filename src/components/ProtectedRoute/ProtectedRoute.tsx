import { Preloader } from '@ui';
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const { getIsAuthChecked, getUser } = userSelectors;
  const isAuthChecked = useSelector(getIsAuthChecked); // isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  const user = useSelector(getUser); // userDataSelector — селектор получения пользователя из store
  const location = useLocation();

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return (
      <Navigate
        replace
        to='/login'
        state={{
          from: {
            ...location,
            backgroundLocation: location.state?.backgroundLocation,
            state: null
          }
        }}
      />
    ); // в поле from объекта location.state записываем информацию о URL
  }

  if (onlyUnAuth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    // при обратном редиректе получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть, если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.backgroundLocation || null;
    return <Navigate replace to={from} state={{ backgroundLocation }} />;
  }

  return children;
};
