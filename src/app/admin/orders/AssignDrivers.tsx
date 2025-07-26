'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

interface Order {
  id: string;
  pickup_location: string;
  drop_location: string;
  vehicle: string;
  created_at: string;
  driver_id?: string;
  status?: string;
}

interface Driver {
  user_id: string;
  driver_name: string;
  available: boolean;
}

export default function AssignDrivers({
  orders: initialOrders,
  drivers: initialDrivers,
}: {
  orders: Order[];
  drivers: Driver[];
}) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [orders, setOrders] = useState(initialOrders);
  const [drivers, setDrivers] = useState(
    initialDrivers.filter((driver) => driver.available)
  );
  const [assigning, setAssigning] = useState<string | null>(null);
  const [disabledOrders, setDisabledOrders] = useState<Set<string>>(new Set());
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [popupOrder, setPopupOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchAssigned = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .not('driver_id', 'is', null);
      if (data) setAssignedOrders(data);
    };
    fetchAssigned();
  }, []);

  const assignDriver = async (orderId: string, driverUserId: string) => {
    setAssigning(orderId);

    const { error: orderErr } = await supabase
      .from('orders')
      .update({ driver_id: driverUserId })
      .eq('id', orderId);

    const { error: driverErr } = await supabase
      .from('drivers')
      .update({ available: false })
      .eq('user_id', driverUserId);

    if (!orderErr && !driverErr) {
      toast.success('✅ Driver assigned successfully');
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setDrivers((prev) => prev.filter((driver) => driver.user_id !== driverUserId));
      setDisabledOrders((prev) => new Set(prev.add(orderId)));
    } else {
      toast.error('❌ Failed to assign driver');
      console.error(orderErr || driverErr);
    }

    setAssigning(null);
  };

  const unassignDriver = async (order: Order) => {
    if (!order.driver_id) return;

    const { error: orderErr } = await supabase
      .from('orders')
      .update({ driver_id: null })
      .eq('id', order.id);

    const { error: driverErr } = await supabase
      .from('drivers')
      .update({ available: true })
      .eq('user_id', order.driver_id);

    if (!orderErr && !driverErr) {
      toast.success('Driver unassigned');
      setAssignedOrders((prev) =>
        prev.filter((o) => o.id !== order.id)
      );
      setOrders((prev) => [...prev, order]);
    } else {
      toast.error('Failed to unassign driver');
    }
  };

  const filteredAssigned = assignedOrders.filter((order) => {
    if (!filterDate) return true;
    return order.created_at.startsWith(filterDate);
  });

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <h1 className="text-2xl font-bold mb-6">🛠 Assign Drivers to Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700 mb-12">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Drop</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Assign Driver</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.pickup_location}</td>
                <td className="px-4 py-3">{order.drop_location}</td>
                <td className="px-4 py-3">{order.vehicle}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue=""
                    onChange={(e) => assignDriver(order.id, e.target.value)}
                    className="border px-2 py-1 rounded dark:bg-black dark:text-white dark:border-gray-600"
                    disabled={assigning === order.id || disabledOrders.has(order.id)}
                  >
                    <option value="" disabled>
                      Select Driver
                    </option>
                    {drivers.map((driver) => (
                      <option key={driver.user_id} value={driver.user_id}>
                        {driver.driver_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📦 Assigned Orders</h2>
        <label className="block mb-2 text-sm">
          Filter by Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="ml-2 border px-2 py-1 rounded dark:bg-black dark:text-white dark:border-gray-600"
          />
        </label>

        <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700 mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b text-gray-700 dark:text-gray-300 uppercase">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Pickup</th>
                <th className="px-4 py-3">Drop</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssigned.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.pickup_location}</td>
                  <td className="px-4 py-3">{order.drop_location}</td>
                  <td className="px-4 py-3">{order.vehicle}</td>
                  <td className="px-4 py-3">{order.status ?? 'unknown'}</td>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => unassignDriver(order)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Unassign
                    </button>
                    <button
                      onClick={() => setPopupOrder(order)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {popupOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <ul className="text-sm space-y-2">
              <li><strong>Pickup:</strong> {popupOrder.pickup_location}</li>
              <li><strong>Drop:</strong> {popupOrder.drop_location}</li>
              <li><strong>Vehicle:</strong> {popupOrder.vehicle}</li>
              <li><strong>Status:</strong> {popupOrder.status}</li>
              <li><strong>Created:</strong> {new Date(popupOrder.created_at).toLocaleString()}</li>
              <li><strong>Driver ID:</strong> {popupOrder.driver_id}</li>
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setPopupOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
