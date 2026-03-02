'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';
import { getCurrentUserWithCompany } from '../../../lib/tenant';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  company_id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
}

export default function EmployeesPage() {
  const { user, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('employee');

  useEffect(() => {
    if (!authLoading && user) {
      fetchEmployees();
    }
  }, [authLoading, user]);


  const fetchEmployees = async () => {
    // restrict employees to the same company as current user
    const profile = await getCurrentUserWithCompany();
    if (!profile) {
      toast.error('Unable to determine user company');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', profile.company_id)
      .neq('role', 'disabled');

    if (error) {
      toast.error('Failed to fetch employees: ' + error.message);
    } else {
      setEmployees(data || []);
    }
  }; 


  const addEmployee = async () => {
    if (!newName || !newEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

// include company_id on creation
      const profile = await getCurrentUserWithCompany();
      if (!profile) {
        toast.error('Unable to determine user company');
        return;
      }

      const { error } = await supabase.from('users').insert([
        {
          company_id: profile.company_id,
          name: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
        },
      ]);

    if (error) {
      toast.error('Failed to add employee: ' + error.message);
    } else {
      toast.success('Employee added');
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('employee');
      fetchEmployees();
    }
  };

  const updateRole = async (empId: string, newRole: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', empId);

    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success('Role updated');
      fetchEmployees();
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to manage employees.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Employees</h1>

      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button
            onClick={addEmployee}
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">All Employees</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{emp.name}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.phone || '-'}</td>
                <td className="p-4">
                  <select
                    value={emp.role}
                    onChange={(e) => updateRole(emp.id, e.target.value)}
                    className="border border-gray-300 p-1 rounded"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => updateRole(emp.id, 'disabled')}
                  >
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
