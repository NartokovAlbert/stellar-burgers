import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import store, { useDispatch, useSelector } from '../../services/store';
import {
  infoState,
  orderActions,
  orderBurger
} from '../../services/slices/orderSlice';
import { userSelectors } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { resetConstructor } from '../../services/slices/constructorSlice';
import { getOrders } from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const ingredients = useSelector(
    (store) => store.constructorBurger.ingredients
  );
  const bun = useSelector((store) => store.constructorBurger.bun);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resetOrderModalData = orderActions.resetCreateOrder();
  const { getUser } = userSelectors;
  const user = useSelector(getUser);
  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const orderRequest = useSelector((store) => store.order.isNewOrderLoading);

  const orderModalData = useSelector((store) => store.order.info?.order);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const ingredientIds = [
        ...constructorItems.ingredients.map((ing) => ing._id),
        constructorItems.bun._id,
        constructorItems.bun._id
      ];
      dispatch(orderBurger(ingredientIds));
      dispatch(getOrders());
    }
  };
  const closeOrderModal = () => {
    dispatch(resetConstructor());
    dispatch(resetOrderModalData);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData!}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
