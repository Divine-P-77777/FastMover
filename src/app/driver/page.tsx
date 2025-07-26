'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { toast } from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface Driver {
  id: number;
  user_id: string;
  username: string;
  vehicle_number: string;
  license_number: string | null;
  driver_name: string;
  phone: string | null;
  available: boolean;
}

interface AssignedOrder {
  id: string;
  pickup_location: string;
  drop_location: string;
  vehicle: string;
  pickup_lat: number;
  pickup_lng: number;
  status: string;
}

export default function DriverHomePage() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [assignedOrder, setAssignedOrder] = useState<AssignedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/driver');
  };

  const fetchDriver = async () => {
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      toast.error('Auth session not found');
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (driverError || !driverData) {
      toast.error('Driver not found');
      setDriver(null);
    } else {
      setDriver(driverData);

      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('driver_id', userId)
        .not('status', 'in.(completed,cancelled)')
        .limit(1)
        .maybeSingle();

      if (orderData) {
        setAssignedOrder(orderData);
      }
    }

    setLoading(false);
  };

  const toggleAvailability = async () => {
    if (!driver) return;

    setToggling(true);
    const { error } = await supabase
      .from('drivers')
      .update({ available: !driver.available })
      .eq('id', driver.id);

    if (error) {
      toast.error('Update failed');
    } else {
      toast.success('Availability updated');
      fetchDriver();
    }

    setToggling(false);
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <p>Loading driver info...</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <p>Driver not found</p>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-xl text-white font-semibold hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50 dark:bg-black dark:text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">
          Welcome, {driver.driver_name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-xl text-white font-semibold hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border dark:border-gray-700 p-6 space-y-4">
        <p><strong>Username:</strong> {driver.username}</p>
        <p><strong>Vehicle Number:</strong> {driver.vehicle_number}</p>
        <p><strong>License Number:</strong> {driver.license_number ?? 'N/A'}</p>
        <p><strong>Phone:</strong> {driver.phone ?? 'N/A'}</p>

        <div className="flex items-center gap-4 pt-4">
          <span className="font-semibold">Available:</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={driver.available}
              onChange={toggleAvailability}
              disabled={!!assignedOrder || toggling}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition"></div>
          </label>
        </div>
      </div>

      {assignedOrder && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md p-6 space-y-3">
          <h2 className="text-xl font-semibold">🚚 Assigned Order</h2>
          <p><strong>Pickup:</strong> {assignedOrder.pickup_location}</p>
          <p><strong>Drop:</strong> {assignedOrder.drop_location}</p>
          <p><strong>Vehicle:</strong> {assignedOrder.vehicle}</p>
          <p><strong>Status:</strong> {assignedOrder.status}</p>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${assignedOrder.pickup_lat},${assignedOrder.pickup_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl mt-2"
          >
            <MapPin size={18} /> Navigate to Pickup
          </a>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link href="#" className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-center font-semibold hover:bg-cyan-50 dark:hover:bg-gray-700 border">History</Link>
        <Link href="/driver/checkpoints" className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-center font-semibold hover:bg-cyan-50 dark:hover:bg-gray-700 border">Checkpoints</Link>
      </div>
    </div>
  );
}
