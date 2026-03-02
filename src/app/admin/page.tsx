'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SalesData {
  employeeId: string;
  employeeName: string;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [filter, setFilter] = useState<{ employee: string; month: string }>(
    {
      employee: 'all',
      month: new Date().toISOString().slice(0, 7),
    }
  );

  useEffect(() => {
    if (!authLoading && user) {
      checkAdminRole();
      fetchEmployees();
      fetchAnalytics();
    }
  }, [authLoading, user, filter]);

  const checkAdminRole = async () => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (
      error ||
      (userData && !['super_admin', 'admin'].includes(userData.role))
    ) {
      router.push('/dashboard');
      toast.error('You do not have admin access');
    }
  };

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

  const fetchAnalytics = async () => {
    const { data: salesDataResp, error } = await supabase
      .from('sales')
      .select('*');

    if (error) {
      toast.error('Failed to fetch sales data');
      return;
    }

    const sales = salesDataResp || [];
    const revenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
    setTotalRevenue(revenue);
    setTotalSales(sales.length);

    const grouped: { [key: string]: SalesData } = {};
    for (const employee of employees) {
      const empSales = sales.filter((s) => s.employee_id === employee.id);
      const empRevenue = empSales.reduce((sum, s) => sum + (s.amount || 0), 0);
      grouped[employee.id] = {
        employeeId: employee.id,
        employeeName: employee.name || employee.email,
        totalSales: empSales.length,
        totalRevenue: empRevenue,
        conversionRate:
          empSales.length > 0
            ? Math.round((empRevenue / (empSales.length * 1000)) * 100)
            : 0,
      };
    }

    setSalesData(Object.values(grouped));
  };

  if (authLoading) return <div>Loading...</div>;

  const topPerformers = salesData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);
  const lowPerformers = salesData
    .sort((a, b) => a.totalRevenue - b.totalRevenue)
    .slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white p-6 rounded">
          <p className="text-sm">Total Employees</p>
          <p className="text-3xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded">
          <p className="text-sm">Total Sales</p>
          <p className="text-3xl font-bold">{totalSales}</p>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded">
          <p className="text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">₹{totalRevenue}</p>
        </div>
        <div className="bg-orange-600 text-white p-6 rounded">
          <p className="text-sm">Avg. Sale Value</p>
          <p className="text-3xl font-bold">
            ₹{totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
          <ul className="space-y-2">
            {topPerformers.map((emp, i) => (
              <li
                key={emp.employeeId}
                className="flex justify-between pb-2 border-b"
              >
                <span className="font-semibold">
                  {i + 1}. {emp.employeeName}
                </span>
                <span className="text-green-600">₹{emp.totalRevenue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Low Performers</h2>
          <ul className="space-y-2">
            {lowPerformers.map((emp, i) => (
              <li
                key={emp.employeeId}
                className="flex justify-between pb-2 border-b"
              >
                <span className="font-semibold">
                  {i + 1}. {emp.employeeName}
                </span>
                <span className="text-red-600">₹{emp.totalRevenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded">
        <h2 className="text-lg font-semibold p-6 border-b">
          Employee Performance
        </h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Total Sales</th>
              <th className="p-4 text-left">Revenue</th>
              <th className="p-4 text-left">Avg Value</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((emp) => (
              <tr key={emp.employeeId} className="border-b hover:bg-gray-50">
                <td className="p-4">{emp.employeeName}</td>
                <td className="p-4">{emp.totalSales}</td>
                <td className="p-4 font-semibold">₹{emp.totalRevenue}</td>
                <td className="p-4">
                  ₹{emp.totalSales > 0 ? Math.round(emp.totalRevenue / emp.totalSales) : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
