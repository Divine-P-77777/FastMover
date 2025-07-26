'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeft } from 'lucide-react';

interface Props {
  pickup: string;
  drop: string;
  onClose: () => void;
}

export default function BookingPopup({ pickup, drop, onClose }: Props) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [vehicle, setVehicle] = useState('Mini Truck');
  const [purpose, setPurpose] = useState('');
  const [size, setSize] = useState('');
  const [labours, setLabours] = useState(false);
  const [noOfLabours, setNoOfLabours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const [pickupLat, setPickupLat] = useState<number | null>(null);
  const [pickupLng, setPickupLng] = useState<number | null>(null);
  const [dropLat, setDropLat] = useState<number | null>(null);
  const [dropLng, setDropLng] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setClientId(data.user.id);
      } else {
        alert('Please login to book an order.');
        router.push('/auth');
      }
    };
    getUser();
  }, []);

  const getPickupLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupLat(pos.coords.latitude);
        setPickupLng(pos.coords.longitude);
      },
      () => {
        alert('Failed to get your current location');
      }
    );
  };

  const handleSubmit = async () => {
    if (!clientId) return;

    setLoading(true);

    const { error } = await supabase.from('orders').insert({
      client_id: clientId,
      pickup_location: pickup,
      drop_location: drop,
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      drop_lat: dropLat,
      drop_lng: dropLng,
      vehicle,
      purpose,
      size,
      labours,
      no_of_labours: labours ? noOfLabours : null,
      total_amount: null,
      paid_amount: 0,
      payment_status: 'pending',
      status: 'pending',
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Failed to create order.');
    } else {
      alert('Order placed successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className={`rounded-lg w-full max-w-md space-y-4 p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <button className={`${isDarkMode ?" bg-blue-400" : "bg-blue-600"} text-white py-2 px-4 rounded-3xl flex cursor-pointer`} onClick={onClose}>
     <span> <ArrowLeft /></span> Change Locations
          </button>
        <h2 className="text-lg font-bold">Book a Vehicle</h2>

        <div className="space-y-2">
          <p><strong>Pickup:</strong> {pickup}</p>
  
          <p><strong>Drop:</strong> {drop}</p>
        </div>

        <div>
          <label className="block text-sm">Purpose</label>
          <input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-transparent"
            placeholder="e.g. House Shifting, Construction"
          />
        </div>

        <div>
          <label className="block text-sm">Goods Size</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-transparent"
            placeholder="Small / Medium / Large"
          />
        </div>

        <div>
          <label className="block text-sm">Vehicle Type</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-transparent"
          >
            <option>Mini Truck</option>
            <option>Tumpu Auto</option>
            <option>Truck</option>
            <option>Tipper Trucks</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={labours}
            onChange={(e) => setLabours(e.target.checked)}
          />
          <label>Need labours?</label>
        </div>

        {labours && (
          <div>
            <label className="block text-sm">No. of labours</label>
            <input
              type="number"
              value={noOfLabours}
              onChange={(e) => setNoOfLabours(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 bg-transparent"
              min={1}
              max={10}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
