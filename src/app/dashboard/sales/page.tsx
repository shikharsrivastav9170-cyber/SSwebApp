'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';
import toast from 'react-hot-toast';

interface Sale {
	id: string;
	amount: number;
	payment_mode: string;
	created_at: string;
}

interface Plan {
	id: string;
	name: string;
	price: number;
}

export default function SalesPage() {
	const { user, loading: authLoading } = useAuth();
	const [sales, setSales] = useState<Sale[]>([]);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [selectedPlan, setSelectedPlan] = useState('');
	const [clientName, setClientName] = useState('');
	const [paymentMode, setPaymentMode] = useState('upi');
	const [totalEarned, setTotalEarned] = useState(0);

	useEffect(() => {
		if (!authLoading && user) {
			fetchSales();
			fetchPlans();
		}
	}, [authLoading, user]);

	const fetchSales = async () => {
		const { data, error } = await supabase
			.from('sales')
			.select('*')
			.eq('employee_id', user?.id)
			.order('created_at', { ascending: false });

		if (error) {
			toast.error('Failed to fetch sales');
		} else {
			setSales(data || []);
			const total = (data || []).reduce((sum, s) => sum + (s.amount || 0), 0);
			setTotalEarned(total);
		}
	};

	const fetchPlans = async () => {
		const { data, error } = await supabase.from('plans').select('*');
		if (error) {
			toast.error('Failed to fetch plans');
		} else {
			setPlans(data || []);
		}
	};

	const recordSale = async () => {
		if (!clientName || !selectedPlan) {
			toast.error('Please fill in all fields');
			return;
		}

		const plan = plans.find((p) => p.id === selectedPlan);
		if (!plan) return;

		const { error } = await supabase.from('sales').insert([
			{
				employee_id: user?.id,
				plan_id: selectedPlan,
				amount: plan.price,
				payment_mode: paymentMode,
			},
		]);

		if (error) {
			toast.error('Failed to record sale');
		} else {
			toast.success('Sale recorded!');
			setClientName('');
			setSelectedPlan('');
			fetchSales();
		}
	};

	if (authLoading) return <div>Loading...</div>;

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Record a Sale</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-blue-600 text-white p-6 rounded">
					<p className="text-sm">Total Sales</p>
					<p className="text-3xl font-bold">{sales.length}</p>
				</div>
				<div className="bg-green-600 text-white p-6 rounded">
					<p className="text-sm">Total Revenue</p>
					<p className="text-3xl font-bold">₹{totalEarned}</p>
				</div>
				<div className="bg-purple-600 text-white p-6 rounded">
					<p className="text-sm">Avg. Sale Value</p>
					<p className="text-3xl font-bold">
						₹{sales.length > 0 ? Math.round(totalEarned / sales.length) : 0}
					</p>
				</div>
			</div>

			<div className="bg-white shadow p-6 rounded mb-6">
				<h2 className="text-lg font-semibold mb-4">New Sale</h2>
				<div className="flex flex-col gap-3">
					<input
						type="text"
						placeholder="Client name"
						value={clientName}
						onChange={(e) => setClientName(e.target.value)}
						className="border border-gray-300 p-3 rounded"
					/>
					<select
						value={selectedPlan}
						onChange={(e) => setSelectedPlan(e.target.value)}
						className="border border-gray-300 p-3 rounded"
					>
						<option value="">Select a plan</option>
						{plans.map((plan) => (
							<option key={plan.id} value={plan.id}>
								{plan.name} - ₹{plan.price}
							</option>
						))}
					</select>
					<select
						value={paymentMode}
						onChange={(e) => setPaymentMode(e.target.value)}
						className="border border-gray-300 p-3 rounded"
					>
						<option value="upi">UPI</option>
						<option value="razorpay">Razorpay</option>
						<option value="bank">Bank Transfer</option>
						<option value="cash">Cash</option>
					</select>
					<button
						onClick={recordSale}
						className="bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700"
					>
						Record Sale
					</button>
				</div>
			</div>

			<div className="bg-white shadow rounded overflow-hidden">
				<h2 className="text-lg font-semibold p-4 border-b">Recent Sales</h2>
				<table className="w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-4 text-left">Amount</th>
							<th className="p-4 text-left">Payment Mode</th>
							<th className="p-4 text-left">Date</th>
						</tr>
					</thead>
					<tbody>
						{sales.map((sale) => (
							<tr key={sale.id} className="border-b hover:bg-gray-50">
								<td className="p-4 font-semibold">₹{sale.amount}</td>
								<td className="p-4 capitalize">{sale.payment_mode}</td>
								<td className="p-4">
									{new Date(sale.created_at).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}