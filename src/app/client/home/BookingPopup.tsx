// app/home/components/BookingPopup.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

const sizes = ['Below 200kg', '200-500kg', '500kg+'];
const vehicles = [
  { name: 'Tata Ace', image: '/vehicles/tata-ace.png' },
  { name: 'Pickup Van', image: '/vehicles/pickup-van.png' },
  { name: 'Auto', image: '/vehicles/auto.png' },
];

export default function BookingPopup({ pickup, drop, onClose }: { pickup: string; drop: string; onClose: () => void }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [labourNeed, setLabourNeed] = useState(false);
  const [labour, setLabour] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl w-[90%] max-w-md p-4 shadow-lg relative">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="text-sm flex items-center gap-1 text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Change Address
          </button>
          <button
            onClick={onClose}
            className="text-xl text-gray-600 hover:text-red-500"
          >✖</button>
        </div>

        {/* Size */}
        <div className="text-sm text-gray-700 py-2">Select Size</div>
        <div className="flex justify-between items-center px-2 mb-4">
          <button
            onClick={() => setSizeIndex((prev) => (prev > 0 ? prev - 1 : sizes.length - 1))}
            className="text-xl"
          >↑</button>
          <span>{sizes[sizeIndex]}</span>
          <button
            onClick={() => setSizeIndex((prev) => (prev + 1) % sizes.length)}
            className="text-xl"
          >↓</button>
        </div>

        {/* Vehicle */}
        <div className="text-sm text-gray-700">Select Vehicle</div>
        <div className="flex justify-between items-center px-2 mb-4">
          <button
            onClick={() => setVehicleIndex((prev) => (prev > 0 ? prev - 1 : vehicles.length - 1))}
          >←</button>
          <div className="flex flex-col items-center">
            <img src={vehicles[vehicleIndex].image} alt={vehicles[vehicleIndex].name} className="h-14 w-auto mb-1" />
            <span className="bg-orange-200 px-4 py-1 rounded-full text-sm">
              {vehicles[vehicleIndex].name}
            </span>
          </div>
          <button
            onClick={() => setVehicleIndex((prev) => (prev + 1) % vehicles.length)}
          >→</button>
        </div>

        {/* Purpose */}
        <div className="text-sm text-gray-700">Purpose</div>
        <select
          className="w-full border px-2 py-1 mb-4 rounded-md"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Select Purpose</option>
          <option value="Delivery">Delivery</option>
          <option value="House Shifting">House Shifting</option>
        </select>

        {/* Labour Need */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={labourNeed}
            onChange={(e) => setLabourNeed(e.target.checked)}
            className="accent-blue-600"
          />
          <label className="text-sm text-gray-700">Need Labours?</label>
        </div>

        {labourNeed && (
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-700">Number of Labours</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLabour((l) => Math.max(1, l - 1))}
                className="bg-blue-500 text-white px-2 rounded"
              >−</button>
              <span>{labour}</span>
              <button
                onClick={() => setLabour((l) => l + 1)}
                className="bg-blue-500 text-white px-2 rounded"
              >+</button>
            </div>
          </div>
        )}

        <button className="w-full bg-[#0B5FAC] text-white py-2 rounded">Next</button>

        <p className="text-xs text-center mt-2 text-gray-500">
          Note: Charges may increase according to the number of labours you will add.
        </p>
      </div>
    </motion.div>
  );
}
