'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '@/supabase/client';
import { toast } from 'react-hot-toast';

interface CreateAuthInputs {
  email: string;
  password: string;
  username: string;
}

interface DriverUser {
  id: string;
  email: string;
  username?: string;
  role: string;
}

interface DriverFormInputs {
  user_id: string;
  vehicle_number: string;
   driver_name: string; // Add this
  phone: string;       // Add this
  license_number?: string;
  license_doc?: string;
  identity_doc?: string;
  verified: boolean;
  available: boolean;
}

interface PartnerCredential {
  username: string;
  password: string;
}

export default function DriverRegistrationPage() {
  // You should fetch this from your auth context/session/user profile.
  // For demo, let's assume you have a hook that gives you { role }
  const [userRole, setUserRole] = useState<string>('client'); // TODO: replace with real logic

  const [users, setUsers] = useState<DriverUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DriverUser[]>([]);
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [credentials, setCredentials] = useState<{ [driverId: number]: PartnerCredential | null }>({});

  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    reset: resetAuthForm,
    formState: { errors: authErrors },
  } = useForm<CreateAuthInputs>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DriverFormInputs>();

  // Fetch current user's role (replace with your real logic)
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        // Assuming you store role in user metadata or have a profile table
        // Example: const role = data.user.user_metadata?.role || 'client';
        setUserRole(data.user.user_metadata?.role || 'client');
      }
    }
    fetchProfile();
  }, []);

  const fetchDriverUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, role')
      .eq('role', 'driver');
    if (error) toast.error('Failed to fetch driver users');
    else {
      setUsers(data || []);
      setFilteredUsers(data || []);
    }
  };

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');
    if (error) toast.error('Failed to fetch drivers');
    else setDrivers(data || []);
  };

  const fetchCredentials = async (driverId: number) => {
  const { data, error } = await supabase
    .from('partner_credentials')
    .select('username, password')
    .eq('driver_id', driverId);

  if (error || !data || data.length === 0) setCredentials((c) => ({ ...c, [driverId]: null }));
  else setCredentials((c) => ({ ...c, [driverId]: data[0] }));
};

  useEffect(() => {
    fetchDriverUsers();
    fetchDrivers();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUsers(
      users.filter((u) =>
        u.email.toLowerCase().includes(lower) ||
        (u.username?.toLowerCase().includes(lower) ?? false)
      )
    );
  }, [search, users]);

  const onCreateAuth: SubmitHandler<CreateAuthInputs> = async ({ email, password, username }) => {
    if (!['admin', 'host_admin'].includes(userRole)) {
      toast.error('Only admin/host_admin can create driver users.');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'driver',
        },
      },
    });

    if (error) {
      toast.error('Auth creation failed: ' + error.message);
    } else {
      toast.success('Auth user created');
      resetAuthForm();
      fetchDriverUsers();
    }
  };

const onSubmitDriver: SubmitHandler<DriverFormInputs> = async (data) => {
  if (!['admin', 'host_admin'].includes(userRole)) {
    toast.error('Only admin/host_admin can register driver info.');
    return;
  }
  try {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== '')
    );
    if (editingId) {
      const { error } = await supabase
        .from('drivers')
        .update(cleanedData)
        .eq('id', editingId);
      if (error) throw error;
      toast.success('Driver updated');
    } else {
      // Insert, log for debug
      console.log("Driver Insert Data:", cleanedData);
      const { error } = await supabase
        .from('drivers')
        .insert(cleanedData);
      if (error) throw error;
      toast.success('Driver created');
    }
    reset();
    setEditingId(null);
    fetchDrivers();
  } catch (e: any) {
    toast.error(e.message);
  }
};

  const handleEdit = (driver: any) => {
    setEditingId(driver.id);
    for (const key in driver) {
      setValue(key as keyof DriverFormInputs, driver[key]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!['admin', 'host_admin'].includes(userRole)) {
      toast.error('Only admin/host_admin can delete drivers.');
      return;
    }
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (error) toast.error('Delete failed');
    else {
      toast.success('Driver deleted');
      fetchDrivers();
    }
  };

  // Generate credentials (calls backend trigger to insert into partner_credentials)
  const handleGenerateCredentials = async (driverId: number) => {
    try {
      // Set generate_credentials to true for this driver, trigger will handle it
      const { error } = await supabase
        .from('drivers')
        .update({ generate_credentials: true })
        .eq('id', driverId);
      if (error) throw error;
      toast.success('Credentials generated');
      // Fetch and show credentials
      setTimeout(() => fetchCredentials(driverId), 1000); // Allow trigger to process
    } catch (e: any) {
      toast.error('Failed to generate credentials: ' + e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 pt-30">
      <h1 className="text-3xl font-bold text-cyan-500">Driver Registration</h1>

      {/* Only show Auth + Driver registration forms to admin/host_admin */}
      {['admin', 'host_admin'].includes(userRole) && (
        <>
          <form onSubmit={handleSubmitAuth(onCreateAuth)} className="p-6 border rounded bg-white shadow">
            <h2 className="text-xl font-semibold mb-4">Create Driver Auth User</h2>
            <input {...registerAuth('email', { required: 'Email is required' })} placeholder="Email" type="email" className="w-full mb-2 p-2 border rounded" />
            {authErrors.email && <p className="text-red-500">{authErrors.email.message}</p>}
            <input {...registerAuth('username', { required: 'Username is required' })} placeholder="Username" type="text" className="w-full mb-2 p-2 border rounded" />
            {authErrors.username && <p className="text-red-500">{authErrors.username.message}</p>}
            <input {...registerAuth('password', { required: 'Password is required' })} placeholder="Password" type="password" className="w-full mb-2 p-2 border rounded" />
            {authErrors.password && <p className="text-red-500">{authErrors.password.message}</p>}
            <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Create Auth User</button>
          </form>

       <form onSubmit={handleSubmit(onSubmitDriver)} className="p-6 border rounded bg-white shadow space-y-4">
  <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Driver Info' : 'Register Driver Info'}</h2>
  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search user by email or username..." className="w-full p-2 border rounded" />
  <select {...register('user_id', { required: 'Driver user required' })} className="w-full p-2 border rounded">
    <option value="">Select driver user...</option>
    {filteredUsers.map((user) => (
      <option key={user.id} value={user.id}>
        {user.email} {user.username ? `(${user.username})` : ''}
      </option>
    ))}
  </select>
  {errors.user_id && <p className="text-red-500">{errors.user_id.message}</p>}

  <input {...register('driver_name', { required: 'Driver full name required' })} placeholder="Driver Full Name" className="w-full p-2 border rounded" />
  {errors.driver_name && <p className="text-red-500">{errors.driver_name.message}</p>}

  <input {...register('phone', { required: 'Phone number required' })} placeholder="Phone Number" className="w-full p-2 border rounded" />
  {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

  <input {...register('vehicle_number', { required: 'Vehicle number required' })} placeholder="Vehicle Number" className="w-full p-2 border rounded" />
  {errors.vehicle_number && <p className="text-red-500">{errors.vehicle_number.message}</p>}

  <input {...register('license_number')} placeholder="License Number" className="w-full p-2 border rounded" />
  <input {...register('license_doc')} placeholder="License Doc (URL)" className="w-full p-2 border rounded" />
  <input {...register('identity_doc')} placeholder="Identity Doc (URL)" className="w-full p-2 border rounded" />
  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input type="checkbox" {...register('verified')} /> Verified
    </label>
    <label className="flex items-center gap-2">
      <input type="checkbox" {...register('available')} defaultChecked /> Available
    </label>
  </div>
  <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">
    {editingId ? 'Update Driver' : 'Register Driver'}
  </button>
</form>
        </>
      )}

      <div className="p-6 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Drivers</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Full Name</th>
              <th>Vehicle</th>
              <th>License #</th>
              <th>Verified</th>
              <th>Available</th>
              <th>Actions</th>
              <th>Credentials</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-b">
                <td>{d.id}</td>
                <td>{d.driver_name}</td>
                <td>{d.vehicle_number}</td>
                <td>{d.license_number}</td>
                <td>{d.verified ? 'Yes' : 'No'}</td>
                <td>{d.available ? 'Yes' : 'No'}</td>
                <td className="space-x-2">
                  {['admin', 'host_admin'].includes(userRole) && (
                    <>
                      <button onClick={() => handleEdit(d)} className="text-blue-500">Edit</button>
                      <button onClick={() => handleDelete(d.id)} className="text-red-500">Delete</button>
                      <button onClick={() => handleGenerateCredentials(d.id)} className="text-green-500">
                        Generate Credentials
                      </button>
                    </>
                  )}
                </td>
                <td>
                  {credentials[d.id] ? (
                    <div>
                      <div><strong>Username:</strong> {credentials[d.id]?.username}</div>
                      <div><strong>Password:</strong> {credentials[d.id]?.password}</div>
                    </div>
                  ) : (
                    <button className="text-gray-500 text-xs" onClick={() => fetchCredentials(d.id)}>
                      Show Credentials
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}