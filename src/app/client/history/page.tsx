'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAppSelector } from '@/store/hooks';
import { useSession } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';

interface Order {
  id: string;
  pickup_location: string;
  drop_location: string;
  vehicle: string;
  status: string;
  payment_status: string;
  total_amount: number;
  paid_amount: number;
  created_at: string;
}

const HistoryPage = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const session = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) {
        setError('You must be logged in to view order history.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          pickup_location,
          drop_location,
          vehicle,
          status,
          payment_status,
          total_amount,
          paid_amount,
          created_at
        `)
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch orders.');
        console.error(error);
      } else {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [session]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">📜 Your Order History</h1>

        {loading ? (
          <div className="flex justify-center items-center space-x-2 text-gray-500">
            <Loader2 className="animate-spin" /> <span>Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Pickup</th>
                  <th className="px-4 py-3">Drop</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 font-medium">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">{order.pickup_location}</td>
                    <td className="px-4 py-3">{order.drop_location}</td>
                    <td className="px-4 py-3">{order.vehicle}</td>
                    <td className="px-4 py-3">₹{order.total_amount ?? 0}</td>
                    <td className="px-4 py-3">₹{order.paid_amount ?? 0}</td>
                    <td className="px-4 py-3 capitalize">{order.payment_status}</td>
                    <td className="px-4 py-3 capitalize">{order.status}</td>
                    <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
