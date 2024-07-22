import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/thunk/user';
import { deleteCookie } from '../../utils/cookie';
import { userActions } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    deleteCookie('accessToken');
    dispatch(userActions.userLogout());
    console.log(1);
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
