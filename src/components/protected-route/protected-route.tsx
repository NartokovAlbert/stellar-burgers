import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  const { isAuthenticated, loginUserRequest, data } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const from = (location.state as { from: { pathname: string } })?.from || {
    pathname: '/'
  };

  if (!isAuthenticated && loginUserRequest) {
    return <Preloader />;
  }

  if (onlyUnAuth && data.name) {
    return <Navigate replace to={from} state={{ from: location }} />;
  }

  if (!onlyUnAuth && !data.name) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
