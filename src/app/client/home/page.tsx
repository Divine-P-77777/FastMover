// app/home/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Clock, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import BookingPopup from './BookingPopup';

const suggestedLocations = [
  'Guwahati Station',
  'Airport',
  'Silpukhuri',
  'Paltan Bazar',
  'Ganeshguri',
  'Kahilipara',
  'Maligaon',
  'Beltola',
];

export default function HomePage() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);

  const handleInput = (value: string, setValue: any, setSuggestions: any) => {
    setValue(value);
    if (value.trim()) {
      const filtered = suggestedLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const triggerPopup = () => {
    if (pickup.trim() !== '' && drop.trim() !== '') {
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#f5f5f5] pb-20">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-[#0B5FAC] text-white md:justify-center">
        <div className="text-lg font-bold">FastMover</div>
        <div className="md:hidden text-2xl">☰</div>
      </header>

      {/* Location Input */}
      <div className="space-y-4 p-4">
        <div className="relative">
          <div className="flex items-center border rounded-full px-4 py-2">
            <span className="mr-2">📍</span>
            <input
              type="text"
              placeholder="Enter pickup Location"
              value={pickup}
              onChange={(e) => handleInput(e.target.value, setPickup, setPickupSuggestions)}
              className="flex-1 outline-none"
            />
            <span onClick={triggerPopup} className="cursor-pointer">🔍</span>
          </div>
          {pickupSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full rounded shadow mt-1 z-10">
              {pickupSuggestions.map((loc) => (
                <li
                  key={loc}
                  onClick={() => {
                    setPickup(loc);
                    setPickupSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <div className="flex items-center border rounded-full px-4 py-2">
            <span className="mr-2">📍</span>
            <input
              type="text"
              placeholder="Enter Drop Location"
              value={drop}
              onChange={(e) => handleInput(e.target.value, setDrop, setDropSuggestions)}
              onKeyDown={(e) => e.key === 'Enter' && triggerPopup()}
              className="flex-1 outline-none"
            />
            <span onClick={triggerPopup} className="cursor-pointer">🔍</span>
          </div>
          {dropSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full rounded shadow mt-1 z-10">
              {dropSuggestions.map((loc) => (
                <li
                  key={loc}
                  onClick={() => {
                    setDrop(loc);
                    setDropSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Booking Form Popup */}
      <AnimatePresence>
        {showPopup && (
          <BookingPopup pickup={pickup} drop={drop} onClose={() => setShowPopup(false)} />
        )}
      </AnimatePresence>

      {/* Banner */}
      <div className="p-4">
        <img src="/banner.jpg" alt="Banner" className="rounded-xl w-full" />
      </div>

      {/* Vehicle Options */}
      <section className="px-4 py-2">
        <h2 className="font-semibold text-gray-700 mb-3">Explore Vehicles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['Mini Truck', 'Tumpu Auto', 'Truck', 'Tipper Trucks'].map((v) => (
            <button
              key={v}
              className={`rounded-lg p-3 text-xs sm:text-sm bg-orange-100 text-black`}
            >
              <div className="text-xl sm:text-2xl">🚚</div>
              <span className="font-medium">{v}</span>
            </button>
          ))}
        </div>
      </section>

      {/* What we offer carousel */}
      <section className="p-4">
        <h2 className="font-bold text-xl mb-2">What we offers</h2>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-center gap-4 overflow-x-auto">
          <img src="/mixer.png" alt="mixer" className="h-20 w-auto" />
          <div>
            <h3 className="font-semibold">Construction Material Transport</h3>
            <p className="text-sm text-gray-600">
              Move cement, bricks, sand, steel, and other building materials.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Safe Tag */}
      <div className="text-center text-xl font-bold py-4">
        <span className="text-green-900">QUICK</span> &nbsp; — &nbsp; <span className="text-gray-700">SAFE</span>
      </div>


    </div>
  );
}
