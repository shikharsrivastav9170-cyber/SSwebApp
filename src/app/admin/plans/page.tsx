'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/useAuth';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
}

export default function PlansPage() {
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      fetchPlans();
    }
  }, [authLoading, user]);

  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
      toast.error('Failed to fetch plans');
    } else {
      setPlans(data || []);
    }
  };

  const addPlan = async () => {
    if (!newPlanName || !newPlanPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const { error } = await supabase.from('plans').insert([
      {
        name: newPlanName,
        price: parseFloat(newPlanPrice),
      },
    ]);

    if (error) {
      toast.error('Failed to add plan');
    } else {
      toast.success('Plan added');
      setNewPlanName('');
      setNewPlanPrice('');
      fetchPlans();
    }
  };

  const deletePlan = async (planId: string) => {
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) {
      toast.error('Failed to delete plan');
    } else {
      toast.success('Plan deleted');
      fetchPlans();
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Plans</h1>

      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Plan</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Plan name (e.g., Starter, Pro, Enterprise)"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <input
            type="number"
            placeholder="Price in ₹"
            value={newPlanPrice}
            onChange={(e) => setNewPlanPrice(e.target.value)}
            className="border border-gray-300 p-3 rounded"
          />
          <button
            onClick={addPlan}
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
          >
            Add Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white shadow rounded p-6 border-t-4 border-blue-600"
          >
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">
              ₹{plan.price}
            </p>
            <button
              onClick={() => deletePlan(plan.id)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No plans created yet.
        </div>
      )}
    </div>
  );
}
