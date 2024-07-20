import '../../index.css';
import styles from './app.module.css';
import {Routes, Route, Location, useLocation} from 'react-router-dom';
import { AppHeader, OrderInfo, Modal, IngredientDetails } from '@components';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import { ConstructorPage , Feed, Login, Register, ForgotPassword, ResetPassword, 
  Profile, ProfileOrders, NotFound404
 } from '@pages';
import { useEffect } from 'react';

import { userActions } from 'src/services/userSlice';
import { useActionCreators } from 'src/services/hooks';


export const App = () => {

  const {authCheck, loginUser, registerUser, checkUserAuth} = useActionCreators(userActions);
  const location: Location<{ backgroundLocation: Location; }> = useLocation();
	const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
		checkUserAuth().unwrap().catch(() => {}).finally(() => authCheck());
	}, [authCheck]);




return <main className={styles.app}>
  <div >
    <AppHeader />
  
    </div>

  <Routes>
    <Route path='/' element={<ConstructorPage />}/>
    <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>}/>
    <Route path='/login' element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>}/>
    <Route path='/register' element={<ProtectedRoute onlyUnAuth><Register /></ProtectedRoute>}/>
    <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>}/>
    <Route path='/reset-password' element={<ProtectedRoute><ResetPassword /></ProtectedRoute>}/>
    <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
    <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>}/>
    <Route path='*' element={<NotFound404 />}/>
  </Routes>
  {backgroundLocation && (
			<Routes>
				<Route path='/feed/:number' element={<Modal title='' onClose= {() => {}} ><OrderInfo /></Modal>} />
        <Route path='/ingredients/:id' element={<Modal title='' onClose= {() => {}} ><IngredientDetails /></Modal>} />
        <Route path='/profile/orders/:number' element={<Modal title='' onClose= {() => {}} ><OrderInfo /></Modal>} />

			</Routes>
			)}


  </main>
};

export default App;
