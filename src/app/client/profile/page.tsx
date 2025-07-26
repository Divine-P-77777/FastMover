// app/myprofile/page.js
'use client'

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useState } from 'react';

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  if (!user) return <p>Loading user data...</p>;

  const email = user.email;
  const avatar = user.user_metadata?.avatar_url || '/default-avatar.png';
  const fullName = user.user_metadata?.full_name || 'Anonymous';
  const createdAt = new Date(user.created_at).toLocaleDateString();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      alert('Failed to logout!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <Image
          src={avatar}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
        <p className="text-gray-600 mb-1">{email}</p>
        <p className="text-sm text-gray-500 mb-4">Member since: {createdAt}</p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
