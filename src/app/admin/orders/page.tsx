// app/admin/orders/page.tsx
import { serviceSupabase } from '@/supabase/serviceClient';
import AssignDrivers from './AssignDrivers';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const [ordersRes, driversRes] = await Promise.all([
    serviceSupabase
      .from('orders')
      .select('*')
      .is('driver_id', null),

    serviceSupabase
      .from('drivers')
      .select('*')
      .eq('available', true),
  ]);

  const orders = ordersRes.data || [];
  const drivers = driversRes.data || [];
  const error = ordersRes.error || driversRes.error;

  if (error) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        ❌ Error fetching data. Check Supabase logs.
      </div>
    );
  }

  return <AssignDrivers orders={orders} drivers={drivers} />;
}
