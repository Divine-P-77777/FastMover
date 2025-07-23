// app/admin/orders/page.tsx
import { serviceSupabase } from '@/supabase/serviceClient';
import AssignDrivers from './AssignDrivers';

export const dynamic = 'force-dynamic'; // always fresh data

export default async function AdminOrdersPage() {
  // Fetch all unassigned orders
  const { data: orders, error: ordersError } = await serviceSupabase
    .from('orders')
    .select('*')
    .is('assigned_driver_id', null);

  // Fetch available drivers
  const { data: drivers, error: driversError } = await serviceSupabase
    .from('drivers')
    .select('*')
    .eq('available', true);

  if (ordersError || driversError) {
    return (
      <div className="p-6 text-red-600">
        Error fetching data. Please check Supabase logs.
      </div>
    );
  }

  return (
    <AssignDrivers orders={orders || []} drivers={drivers || []} />
  );
}
