import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectorFeed } from '../../services/slices/feedSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const { selectorOrders, selectorTotal, selectorTotalToday } = selectorFeed;

  const orders = useSelector(selectorOrders);
  const total = useSelector(selectorTotal);
  const totalToday = useSelector(selectorTotalToday);
  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
