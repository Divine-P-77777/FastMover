'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { toast } from 'react-hot-toast';

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

export default function DriverHomePage() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
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
    <div className="min-h-screen p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-700">
          Welcome, {driver.driver_name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-xl text-white font-semibold hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
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
              disabled={toggling}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="#" className="p-4 bg-white rounded-xl shadow text-center font-semibold hover:bg-cyan-50 border">History</a>
        <a href="#" className="p-4 bg-white rounded-xl shadow text-center font-semibold hover:bg-cyan-50 border">Checkpoints</a>
      </div>
    </div>
  );
}
