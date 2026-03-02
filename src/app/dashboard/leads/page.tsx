'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState('all');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeads();
    }
  }, [authLoading, user]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch leads');
    } else {
      setLeads(data || []);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      toast.error('Failed to update lead');
    } else {
      toast.success('Lead updated');
      fetchLeads();
    }
  };

  const addLead = async () => {
    if (!newLeadName || !newLeadPhone) {
      toast.error('Please fill in all fields');
      return;
    }

    const { error } = await supabase.from('leads').insert([
      {
        name: newLeadName,
        phone: newLeadPhone,
        assigned_to: user?.id,
        status: 'new',
      },
    ]);

    if (error) {
      toast.error('Failed to add lead');
    } else {
      toast.success('Lead added');
      setNewLeadName('');
      setNewLeadPhone('');
      fetchLeads();
    }
  };

  if (authLoading) return <div>Loading...</div>;

  const filteredLeads =
    status === 'all' ? leads : leads.filter((l) => l.status === status);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Lead name"
            value={newLeadName}
            onChange={(e) => setNewLeadName(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newLeadPhone}
            onChange={(e) => setNewLeadPhone(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded"
          />
          <button
            onClick={addLead}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setStatus('all')}
          className={`px-4 py-2 rounded ${
            status === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatus('new')}
          className={`px-4 py-2 rounded ${
            status === 'new'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setStatus('connected')}
          className={`px-4 py-2 rounded ${
            status === 'connected'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Connected
        </button>
        <button
          onClick={() => setStatus('follow_up')}
          className={`px-4 py-2 rounded ${
            status === 'follow_up'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Follow-up
        </button>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.phone}</td>
                <td className="p-4">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateLeadStatus(lead.id, e.target.value)
                    }
                    className="border border-gray-300 p-1 rounded"
                  >
                    <option value="new">New</option>
                    <option value="connected">Connected</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="sale_closed">Sale Closed</option>
                  </select>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline">
                    Details
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
