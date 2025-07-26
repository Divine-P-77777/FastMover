'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const STATUS_FLOW = [
  'pending',
  'confirmed',
  'loading',
  'on_the_way',
  'completed'
];

export default function CheckpointPage() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = async () => {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      toast.error('Unauthorized');
      router.push('/driver');
      return;
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('driver_id', userId)
      .not('status', 'in.(completed,cancelled)')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      toast.error('No assigned order found');
      router.push('/driver');
    } else {
      setOrder(data);
      setStatusIndex(STATUS_FLOW.indexOf(data.status));
    }
    setLoading(false);
  };

  const updateStatus = async () => {
    if (!order || statusIndex >= STATUS_FLOW.length - 1) return;
    const nextStatus = STATUS_FLOW[statusIndex + 1];
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', order.id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Status updated to ${nextStatus}`);
      setStatusIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!order) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black dark:text-white space-y-6">
      <h1 className="text-2xl font-bold">📍 Checkpoints</h1>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-4 space-y-2">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Pickup:</strong> {order.pickup_location}</p>
        <p><strong>Drop:</strong> {order.drop_location}</p>
        <p><strong>Current Status:</strong> {STATUS_FLOW[statusIndex]}</p>
      </div>

      <div className="space-x-4">
        <button
          onClick={updateStatus}
          disabled={statusIndex >= STATUS_FLOW.length - 1}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Move to Next Checkpoint
        </button>
      </div>
    </div>
  );
}
