// app/book/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookPage() {
  const [dropLocation, setDropLocation] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [vehicle, setVehicle] = useState('Mini Truck');
  const [size, setSize] = useState('BELOW 100 KG');
  const [labour, setLabour] = useState(1);
  const [purpose, setPurpose] = useState('');

  const handleDropEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && dropLocation.trim() !== '') {
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Book Now</h1>

      <input
        type="text"
        placeholder="Enter Drop Location"
        value={dropLocation}
        onChange={(e) => setDropLocation(e.target.value)}
        onKeyDown={handleDropEnter}
        className="w-full border px-4 py-2 rounded mb-6"
      />

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl w-[90%] max-w-md p-4 shadow-lg relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 text-xl"
              >
                ✖
              </button>

              <h2 className="text-lg font-semibold mb-3">Complete Your Booking</h2>

              <div className="text-sm text-gray-700 py-2">Select Size</div>
              <div className="flex justify-between items-center px-2 mb-4">
                <button className="text-xl">↑</button>
                <span>{size}</span>
                <button className="text-xl">↓</button>
              </div>

              <div className="text-sm text-gray-700">Select Vehicle</div>
              <div className="flex justify-between items-center px-2 mb-4">
                <button>←</button>
                <span className="bg-orange-200 px-4 py-1 rounded-full">{vehicle}</span>
                <button>→</button>
              </div>

              <div className="text-sm text-gray-700">Purpose</div>
              <select
                className="w-full border px-2 py-1 mb-4 rounded-md"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="">Purpose</option>
                <option value="Delivery">Delivery</option>
                <option value="House Shifting">House Shifting</option>
              </select>

              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-700">Labor Need</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLabour((l) => Math.max(0, l - 1))}
                    className="bg-blue-500 text-white px-2 rounded"
                  >−</button>
                  <span>{labour}</span>
                  <button
                    onClick={() => setLabour((l) => l + 1)}
                    className="bg-blue-500 text-white px-2 rounded"
                  >+</button>
                </div>
              </div>

              <button className="w-full bg-[#0B5FAC] text-white py-2 rounded">Next</button>

              <p className="text-xs text-center mt-2 text-gray-500">
                Note: Charges may increase according to the number of labours you will add.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
