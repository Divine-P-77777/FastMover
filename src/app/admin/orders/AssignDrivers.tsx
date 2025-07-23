'use client';

import { useState } from 'react';
import { supabase } from '@/supabase/client';

type Order = {
  id: number;
  pickup_location: string;
  drop_location: string;
  vehicle: string;
};

type Driver = {
  id: number;
  driver_name: string;
  available: boolean;
};

export default function AssignDrivers({
  orders: initialOrders,
  drivers: initialDrivers,
}: {
  orders: Order[];
  drivers: Driver[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [drivers, setDrivers] = useState(
    initialDrivers.filter((driver) => driver.available) // ✅ Only available drivers
  );
  const [assigning, setAssigning] = useState<number | null>(null);

  const assignDriver = async (orderId: number, driverId: number) => {
    setAssigning(orderId);

    // Update order to assign driver
    const { error: orderErr } = await supabase
      .from('orders')
      .update({ assigned_driver_id: driverId })
      .eq('id', orderId);

    // Update driver to mark as unavailable
    const { error: driverErr } = await supabase
      .from('drivers')
      .update({ available: false })
      .eq('id', driverId);

    if (!orderErr && !driverErr) {
      // Remove assigned order and driver from list
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setDrivers((prev) => prev.filter((driver) => driver.id !== driverId));
    } else {
      alert('❌ Failed to assign driver.');
      console.error(orderErr || driverErr);
    }

    setAssigning(null);
  };

  if (orders.length === 0) {
    return <p className="text-green-600 p-6">✅ All orders have assigned drivers!</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">🛠 Assign Drivers to Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-700 uppercase">
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
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.pickup_location}</td>
                <td className="px-4 py-3">{order.drop_location}</td>
                <td className="px-4 py-3">{order.vehicle}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      assignDriver(order.id, Number(e.target.value))
                    }
                    className="border px-2 py-1 rounded"
                    disabled={assigning === order.id}
                  >
                    <option value="" disabled>
                      Select Driver
                    </option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
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
    </div>
  );
}
