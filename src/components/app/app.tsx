import React, { useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientReducer';
import { fetchGetUser } from '../../services/slices/userReducer';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

const useInitialDataLoad = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchGetUser());
    localStorage.removeItem('resetPassword');
  }, [dispatch]);
};

interface ModalRoutesProps {
  background: Location;
  closeModal: () => void;
}

const ModalRoutes: React.FC<ModalRoutesProps> = ({
  background,
  closeModal
}) => {
  const orderInfoTitle = 'Информация о заказе';
  const ingredientDetailsTitle = 'Детали ингредиента';

  return (
    <Routes>
      <Route
        path='/feed/:number'
        element={
          <Modal title={orderInfoTitle} onClose={closeModal}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/ingredients/:id'
        element={
          <Modal title={ingredientDetailsTitle} onClose={closeModal}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <Modal title={orderInfoTitle} onClose={closeModal}>
            <OrderInfo />
          </Modal>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useInitialDataLoad();

  const closeModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
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
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <ModalRoutes background={background} closeModal={closeModal} />
      )}
    </div>
  );
};

export default App;
