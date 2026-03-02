'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';
import toast from 'react-hot-toast';

interface Target {
	id: string;
	amount: number;
	month: string;
}

export default function TargetsPage() {
	const { user, loading: authLoading } = useAuth();
	const [target, setTarget] = useState<Target | null>(null);
	const [achieved, setAchieved] = useState(0);
	const [incentive, setIncentive] = useState(0);
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		if (!authLoading && user) {
			fetchTargetAndAchieved();
		}
	}, [authLoading, user]);

	const fetchTargetAndAchieved = async () => {
		// Fetch this month's target
		const now = new Date();
		const monthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

		const { data: targetData, error: targetError } = await supabase
			.from('targets')
			.select('*')
			.eq('employee_id', user?.id)
			.ilike('month', monthStr + '%')
			.single();

		if (targetError && targetError.code !== 'PGRST116') {
			toast.error('Failed to fetch target');
		} else {
			setTarget(targetData || null);
		}

		// Fetch this month's sales
		const { data: salesData, error: salesError } = await supabase
			.from('sales')
			.select('amount')
			.eq('employee_id', user?.id)
			.gte('created_at', monthStr + '-01')
			.lte('created_at', monthStr + '-31');

		if (salesError) {
			toast.error('Failed to fetch sales');
		} else {
			const total = (salesData || []).reduce((sum, s) => sum + (s.amount || 0), 0);
			setAchieved(total);

			if (targetData) {
				const pct = Math.round((total / targetData.amount) * 100);
				setPercentage(pct);
				// Simple incentive: if >= 100%, get 10%, else 0%
				const inc = pct >= 100 ? total * 0.1 : 0;
				setIncentive(inc);
			}
		}
	};

	if (authLoading) return <div>Loading...</div>

	const remaining = target ? Math.max(0, target.amount - achieved) : 0;

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">This Month's Target</h1>

			{target ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white shadow p-6 rounded">
						<h2 className="text-lg font-semibold mb-4">Target Progress</h2>
						<div className="mb-4">
							<div className="flex justify-between mb-2">
								<span>Target</span>
								<span className="font-bold">₹{target.amount}</span>
							</div>
							<div className="bg-gray-200 rounded h-8 overflow-hidden">
								<div
									className="bg-blue-600 h-full flex items-center justify-center text-white text-sm font-bold"
									style={{ width: `${Math.min(percentage, 100)}%` }}
								>
									{percentage}%
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-green-50 p-4 rounded">
								<p className="text-sm text-gray-600">Achieved</p>
								<p className="text-2xl font-bold text-green-600">₹{achieved}</p>
							</div>
							<div className="bg-red-50 p-4 rounded">
								<p className="text-sm text-gray-600">Remaining</p>
								<p className="text-2xl font-bold text-red-600">₹{remaining}</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="bg-white shadow p-6 rounded">
							<h3 className="text-lg font-semibold mb-2">Achievement %</h3>
							<p className="text-4xl font-bold text-blue-600">{percentage}%</p>
						</div>
						<div className="bg-white shadow p-6 rounded">
							<h3 className="text-lg font-semibold mb-2">Incentive Earned</h3>
							<p className="text-4xl font-bold text-green-600">₹{Math.round(incentive)}</p>
							{percentage < 100 && (
								<p className="text-sm text-red-600 mt-2">Reach 100% target to earn incentive</p>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
					<p className="text-yellow-800">No target set for this month yet.</p>
				</div>
			)}
		</div>
	);
}
'use client';\n\nimport React, { useState, useEffect } from 'react';\nimport { supabase } from '../../../lib/supabaseClient';\nimport { useAuth } from '../../../lib/useAuth';\nimport toast from 'react-hot-toast';\n\ninterface Target {\n  id: string;\n  amount: number;\n  month: string;\n}\n\nexport default function TargetsPage() {\n  const { user, loading: authLoading } = useAuth();\n  const [target, setTarget] = useState<Target | null>(null);\n  const [achieved, setAchieved] = useState(0);\n  const [incentive, setIncentive] = useState(0);\n  const [percentage, setPercentage] = useState(0);\n\n  useEffect(() => {\n    if (!authLoading && user) {\n      fetchTargetAndAchieved();\n    }\n  }, [authLoading, user]);\n\n  const fetchTargetAndAchieved = async () => {\n    // Fetch this month's target\n    const now = new Date();\n    const monthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');\n\n    const { data: targetData, error: targetError } = await supabase\n      .from('targets')\n      .select('*')\n      .eq('employee_id', user?.id)\n      .ilike('month', monthStr + '%')\n      .single();\n\n    if (targetError && targetError.code !== 'PGRST116') {\n      toast.error('Failed to fetch target');\n    } else {\n      setTarget(targetData || null);\n    }\n\n    // Fetch this month's sales\n    const { data: salesData, error: salesError } = await supabase\n      .from('sales')\n      .select('amount')\n      .eq('employee_id', user?.id)\n      .gte('created_at', monthStr + '-01')\n      .lte('created_at', monthStr + '-31');\n\n    if (salesError) {\n      toast.error('Failed to fetch sales');\n    } else {\n      const total = (salesData || []).reduce((sum, s) => sum + (s.amount || 0), 0);\n      setAchieved(total);\n\n      if (targetData) {\n        const pct = Math.round((total / targetData.amount) * 100);\n        setPercentage(pct);\n        // Simple incentive: if >= 100%, get 10%, else 0%\n        const inc = pct >= 100 ? total * 0.1 : 0;\n        setIncentive(inc);\n      }\n    }\n  };\n\n  if (authLoading) return <div>Loading...</div>\n\n  const remaining = target ? Math.max(0, target.amount - achieved) : 0;\n\n  return (\n    <div>\n      <h1 className=\"text-3xl font-bold mb-6\">This Month's Target</h1>\n\n      {target ? (\n        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n          <div className=\"bg-white shadow p-6 rounded\">\n            <h2 className=\"text-lg font-semibold mb-4\">Target Progress</h2>\n            <div className=\"mb-4\">\n              <div className=\"flex justify-between mb-2\">\n                <span>Target</span>\n                <span className=\"font-bold\">₹{target.amount}</span>\n              </div>\n              <div className=\"bg-gray-200 rounded h-8 overflow-hidden\">\n                <div\n                  className=\"bg-blue-600 h-full flex items-center justify-center text-white text-sm font-bold\"\n                  style={{ width: `${Math.min(percentage, 100)}%` }}\n                >\n                  {percentage}%\n                </div>\n              </div>\n            </div>\n            <div className=\"grid grid-cols-2 gap-4\">\n              <div className=\"bg-green-50 p-4 rounded\">\n                <p className=\"text-sm text-gray-600\">Achieved</p>\n                <p className=\"text-2xl font-bold text-green-600\">₹{achieved}</p>\n              </div>\n              <div className=\"bg-red-50 p-4 rounded\">\n                <p className=\"text-sm text-gray-600\">Remaining</p>\n                <p className=\"text-2xl font-bold text-red-600\">₹{remaining}</p>\n              </div>\n            </div>\n          </div>\n\n          <div className=\"space-y-4\">\n            <div className=\"bg-white shadow p-6 rounded\">\n              <h3 className=\"text-lg font-semibold mb-2\">Achievement %</h3>\n              <p className=\"text-4xl font-bold text-blue-600\">{percentage}%</p>\n            </div>\n            <div className=\"bg-white shadow p-6 rounded\">\n              <h3 className=\"text-lg font-semibold mb-2\">Incentive Earned</h3>\n              <p className=\"text-4xl font-bold text-green-600\">₹{Math.round(incentive)}</p>\n              {percentage < 100 && (\n                <p className=\"text-sm text-red-600 mt-2\">Reach 100% target to earn incentive</p>\n              )}\n            </div>\n          </div>\n        </div>\n      ) : (\n        <div className=\"bg-yellow-50 border border-yellow-200 p-4 rounded\">\n          <p className=\"text-yellow-800\">No target set for this month yet.</p>\n        </div>\n      )}\n    </div>\n  );\n}\n