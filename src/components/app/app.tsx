import '../../index.css';
import styles from './app.module.css';
import {
  Routes,
  Route,
  Location,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AppHeader, OrderInfo, Modal, IngredientDetails } from '@components';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { useEffect } from 'react';

import { userActions } from '../../services/slices/userSlice';
import { useActionCreators } from '../../services/hooks';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch } from '../../services/store';
import { getFeed } from '../../services/slices/feedSlice';
import { getOrders } from '../../services/slices/ordersSlice';

export const App = () => {
  const { authCheck, loginUser, registerUser, checkUserAuth } =
    useActionCreators(userActions);
  const location: Location<{ backgroundLocation: Location }> = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCloseModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    checkUserAuth()
      .unwrap()
      .catch(() => {})
      .finally(() => authCheck());
    dispatch(getIngredients());
    dispatch(getFeed());
    dispatch(getOrders());
  }, [authCheck]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={onCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
