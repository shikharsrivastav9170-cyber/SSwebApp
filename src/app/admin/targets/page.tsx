'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/useAuth';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface Target {
  id: string;
  employee_id: string;
  employee_name: string;
  month: string;
  amount: number;
}

export default function TargetsPage() {
  const { user, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      fetchEmployees();
      fetchTargets();
    }
  }, [authLoading, user]);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employee');

    if (error) {
      toast.error('Failed to fetch employees');
    } else {
      setEmployees(data || []);
    }
  };

  const fetchTargets = async () => {
    const { data, error } = await supabase.from('targets').select('*');

    if (error) {
      toast.error('Failed to fetch targets');
    } else {
      const enriched = (data || []).map((t) => {
        const emp = employees.find((e) => e.id === t.employee_id);
        return {
          ...t,
          employee_name: emp?.name || 'Unknown',
        };
      });
      setTargets(enriched);
    }
  };

  const setTarget = async () => {
    if (!selectedEmployee || !targetAmount) {
      toast.error('Please select an employee and enter target amount');
      return;
    }

    const existing = targets.find(
      (t) =>
        t.employee_id === selectedEmployee &&
        t.month.startsWith(selectedMonth)
    );

    if (existing) {
      const { error } = await supabase
        .from('targets')
        .update({ amount: parseFloat(targetAmount) })
        .eq('id', existing.id);

      if (error) {
        toast.error('Failed to update target');
      } else {
        toast.success('Target updated');
      }
    } else {
      const { error } = await supabase.from('targets').insert([
        {
          employee_id: selectedEmployee,
          month: selectedMonth,
          amount: parseFloat(targetAmount),
        },
      ]);

      if (error) {
        toast.error('Failed to set target');
      } else {
        toast.success('Target set');
      }
    }

    setTargetAmount('');
    fetchTargets();
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Set Monthly Targets</h1>

      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Set Target</h2>
        <div className="flex flex-col gap-3">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            classity="border border-gray-300 p-3 rounded"
          />
          <input
            type="number"
            placeholder="Target amount in ₹"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <button
            onClick={setTarget}
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
          >
            Set Target
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Current Targets</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Month</th>
              <th className="p-4 text-left">Target Amount</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target) => (
              <tr key={target.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{target.employee_name}</td>
                <td className="p-4">{target.month}</td>
                <td className="p-4 font-semibold">₹{target.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
