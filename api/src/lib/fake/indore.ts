export const INDORE_PREDICTIONS = [
	{
		id: 101,
		title: 'ICU Overload Risk - Indore Central Cluster',
		description: 'Projected ICU occupancy may reach 92% in central cluster within 3 hours.',
		type: 'critical',
	},
	{
		id: 102,
		title: 'Ambulance Demand Spike - Indore Eastside',
		description: 'Elevated transfer demand expected in eastside corridor for the next 2 hours.',
		type: 'warning',
	},
	{
		id: 103,
		title: 'Resource Stability Signal',
		description: 'Oxygen and ventilator utilization are stable across most Indore facilities.',
		type: 'info',
	},
];

export const INDORE_TRANSFERS = [
	{
		id: 'ind-tr-1',
		patient_code: 'PT-1033',
		from_hospital: 'Indore Eastside Medical',
		to_hospital: 'Indore Central Care',
		status: 'IN_TRANSIT',
		eta_min: 12,
		updated_at: '2026-03-17T06:10:00Z',
	},
	{
		id: 'ind-tr-2',
		patient_code: 'PT-1042',
		from_hospital: 'Indore General Unit',
		to_hospital: 'Indore North Wing',
		status: 'ACCEPTED',
		eta_min: 18,
		updated_at: '2026-03-17T06:12:00Z',
	},
	{
		id: 'ind-tr-3',
		patient_code: 'PT-1051',
		from_hospital: 'Indore District Care',
		to_hospital: 'Indore Trauma Centre',
		status: 'REQUESTED',
		eta_min: 21,
		updated_at: '2026-03-17T06:14:00Z',
	},
];
