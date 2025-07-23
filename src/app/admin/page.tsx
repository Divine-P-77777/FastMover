"use client"
import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const AdminHome = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'>
      <div className='grid grid-cols-2 gap-2'>
      
        <Link href="/admin/access-board" className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>Admin Access Board</Link>
        <Link href="/admin/orders" className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>Orders Dashboard</Link>
        <Link href="/admin/driver-registration" className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>Driver Registration</Link>
        <Link href="/admin/card" className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>Card</Link>
      </div>
     
    </div>
  )
}

export default AdminHome
