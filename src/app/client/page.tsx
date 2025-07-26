// app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Home, Clock, User, MapPin, Route } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import BookingPopup from './BookingPopup';
import { useAppSelector } from '@/store/hooks';
import { getAddressFromCoords } from '@/utils/location';
import { Loader2 } from 'lucide-react';
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
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
const [showPopup, setShowPopup] = useState(false);
  const [isLoadingDrop, setIsLoadingDrop] = useState(false);


  const handleDropInput = (value: string) => {
    setDrop(value);
    if (value.trim()) {
      const filtered = suggestedLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setDropSuggestions(filtered.length > 0 ? filtered : ['No results found']);
    } else {
      setDropSuggestions([]);
    }
  };
  const handleInput = async (value: string, setValue: any, setSuggestions: any) => {
    setValue(value);
    if (value.trim()) {
      const filtered = suggestedLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      const updated = filtered.length > 0 ? ['📍 Use my current location', ...filtered] : ['No results found'];
      setSuggestions(updated);
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationClick = async (setValue: any) => {
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = await getAddressFromCoords(latitude, longitude);
        if (address) setValue(address);
      });
    } catch {
      alert('Location access denied');
    }
  };

  const triggerPopup = () => {
    if (pickup.trim() === '' || drop.trim() === '') return;
    if (pickup === drop) {
      alert('Pickup and Drop locations cannot be the same.');
      return;
    }
    setShowPopup(true);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-[#0B5FAC] text-white md:justify-center">
        <div className="text-lg font-bold">FastMover</div>
        <div className="md:hidden text-2xl">☰</div>
      </header>

      {/* Location Input */}
      <div className='flex flex-col sm:flex-row items-center justify-center mt-8 space-y-4 mx-4'>
        <div className="space-y-4 p-4 max-w-xl mx-auto">
          <div className='gap-2 flex flex-col items-start'>
            <h1 className='text-5xl'>Welcome Back !</h1>
            <h2 className='text-2xl'>To <span className='font-semibold text-blue-600'>FastMover</span></h2>
            <p className='text-xl'>Your own goods delivery partner.</p>
          </div>

          {/* Pickup */}
          <div className="relative">
            <div className={`flex items-center border rounded-full px-4 py-2 shadow-sm ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
              <MapPin className="mr-2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => handleInput(e.target.value, setPickup, setPickupSuggestions)}
                className={`flex-1 outline-none ${isDarkMode ? 'text-white placeholder-gray-100' : 'text-black placeholder-gray-900'}`}
              />
              <Route className="mr-2 text-gray-500 cursor-pointer" size={18} onClick={() => handleLocationClick(setPickup)} />
              {isLoadingDrop && <Loader2 className="animate-spin text-gray-400 ml-2" size={18} />}
            </div>
            {pickupSuggestions.length > 0 && (
              <ul className={`absolute border w-full rounded shadow mt-1 z-10 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                {pickupSuggestions.map((loc, idx) => (
                  <li
                    key={loc + idx}
                    onClick={() => {
                      if (loc === '📍 Use my current location') handleLocationClick(setPickup);
                      else if (loc !== 'No results found') setPickup(loc);
                      setPickupSuggestions([]);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`}
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Drop */}
 <div className="relative">
  <div className={`flex items-center border rounded-full px-4 py-2 shadow-sm ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
    <MapPin className="mr-2 text-gray-500" size={18} />
    <input
      type="text"
      placeholder="Enter drop location"
      value={drop}
      onChange={(e) => handleDropInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && triggerPopup()}
      className={`flex-1 outline-none ${isDarkMode ? 'text-white placeholder-gray-100' : 'text-black placeholder-gray-900'}`}
    />
    {isLoadingDrop && <Loader2 className="animate-spin text-gray-400 ml-2" size={18} />}
  </div>

  {dropSuggestions.length > 0 && (
    <ul className={`absolute border w-full rounded shadow mt-1 z-10 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {dropSuggestions.map((loc, idx) => (
        <li
          key={loc + idx}
          onClick={() => {
            if (loc !== 'No results found') {
              setDrop(loc);
            }
            setDropSuggestions([]);
          }}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`}
        >
          {loc}
        </li>
      ))}
    </ul>
  )}
</div>


          {/* Next Button */}
          {pickup.trim() !== '' && drop.trim() !== '' && (
            <button
              onClick={triggerPopup}
              className="mt-4 bg-blue-600 w-full text-white py-2 rounded-full font-semibold hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>

        <div className='overflow-hidden rounded-2xl border box-border w-fit'>
          <img
            src="https://img.freepik.com/premium-vector/concept-service-moving-anywhere-world-vector-illustration_357257-958.jpg"
            alt=""
            className='w-[600px] h-auto shadow-md object-cover'
          />
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && <BookingPopup pickup={pickup} drop={drop} onClose={() => setShowPopup(false)} />}
      </AnimatePresence>

      {/* Advertisement (Desktop only) */}
      <div className="hidden md:flex flex-col gap-8 mt-12 px-12">
        <div className="flex gap-10 items-center">
          <img src="/furniture.png" alt="Furniture" className="w-64 rounded-xl" />
          <div>
            <h2 className="text-xl font-bold">Furniture Transport</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Hassle-free shifting for beds, wardrobes, tables, and sofas within city.
            </p>
          </div>
        </div>
        <div className="flex gap-10 items-center flex-row-reverse">
          <img src="/veggies.png" alt="Vegetables" className="w-64 rounded-xl" />
          <div>
            <h2 className="text-xl font-bold">Vegetables & Perishables</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Deliver fresh produce quickly and reliably.
            </p>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <img src="/toys.png" alt="Toys" className="w-64 rounded-xl" />
          <div>
            <h2 className="text-xl font-bold">Toys, Gadgets, and Parts</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Small packages and e-commerce deliveries made easy.
            </p>
          </div>
        </div>
        <div className="flex gap-10 items-center flex-row-reverse">
          <img src="/motorparts.png" alt="Motor Parts" className="w-64 rounded-xl" />
          <div>
            <h2 className="text-xl font-bold">Motor & Auto Parts</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Critical motor and bike parts delivered in time to garages or customers.
            </p>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <img src="/events.png" alt="Event Goods" className="w-64 rounded-xl" />
          <div>
            <h2 className="text-xl font-bold">Event Goods & Props</h2>
            <p className="text-gray-600 dark:text-gray-300">
              On-time delivery of sound systems, chairs, tents, and decor materials.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xl font-bold py-4">
        <span className="text-green-900">QUICK</span> &nbsp; — &nbsp; <span className="text-gray-700">SAFE</span>
      </div>
    </div>
  );
}