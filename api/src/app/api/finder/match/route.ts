import { NextRequest, NextResponse } from 'next/server';

type HospitalMatch = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	score: number;
	distanceKm: number;
	etaMin: number;
	routeStatus: string;
	workloadBadge: string;
	aiReason: string;
	resource: {
		icuAvailable: number;
		ventilatorAvailable: number;
		doctorAvailable: number;
		oxygenPct: number;
	};
};

const CITY_CENTER: Record<string, { lat: number; lng: number }> = {
	Indore: { lat: 22.7196, lng: 75.8577 },
	Bhopal: { lat: 23.2599, lng: 77.4126 },
	Ujjain: { lat: 23.1765, lng: 75.7885 },
};

const CITY_HOSPITALS: Record<string, Array<{ id: string; name: string; latOffset: number; lngOffset: number; icu: number; vent: number; docs: number; oxygen: number; load: string }>> = {
	Indore: [
		{ id: 'IND-H1', name: 'Indore Central Hospital', latOffset: 0.0, lngOffset: 0.0, icu: 12, vent: 6, docs: 24, oxygen: 78, load: 'Balanced load' },
		{ id: 'IND-H2', name: 'Eastside Medical Centre', latOffset: -0.017, lngOffset: 0.022, icu: 8, vent: 4, docs: 16, oxygen: 74, load: 'Moderate load' },
		{ id: 'IND-H3', name: 'North Wing General Hospital', latOffset: 0.021, lngOffset: 0.018, icu: 6, vent: 3, docs: 13, oxygen: 71, load: 'Priority support' },
	],
	Bhopal: [
		{ id: 'BHO-H1', name: 'Bhopal Central Trauma Care', latOffset: 0.0, lngOffset: 0.0, icu: 10, vent: 5, docs: 20, oxygen: 77, load: 'Moderate load' },
		{ id: 'BHO-H2', name: 'JP Hospital Bhopal', latOffset: -0.013, lngOffset: 0.019, icu: 7, vent: 3, docs: 14, oxygen: 73, load: 'Balanced load' },
		{ id: 'BHO-H3', name: 'AIIMS Bhopal Emergency Block', latOffset: 0.018, lngOffset: -0.014, icu: 9, vent: 4, docs: 18, oxygen: 79, load: 'Moderate load' },
	],
	Ujjain: [
		{ id: 'UJJ-H1', name: 'Ujjain District Hospital', latOffset: 0.0, lngOffset: 0.0, icu: 7, vent: 3, docs: 14, oxygen: 74, load: 'Priority support' },
		{ id: 'UJJ-H2', name: 'R D Gardi Medical College', latOffset: -0.011, lngOffset: 0.017, icu: 5, vent: 2, docs: 11, oxygen: 72, load: 'Moderate load' },
		{ id: 'UJJ-H3', name: 'Civil Hospital Ujjain', latOffset: 0.015, lngOffset: -0.009, icu: 6, vent: 3, docs: 12, oxygen: 75, load: 'Balanced load' },
	],
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function estimateEta(distanceKm: number) {
	return Math.max(7, Math.round(distanceKm * 3.5));
}

export async function GET(request: NextRequest) {
	try {
		const city = request.nextUrl.searchParams.get('city') || 'Indore';
		const latParam = Number(request.nextUrl.searchParams.get('lat'));
		const lngParam = Number(request.nextUrl.searchParams.get('lng'));
		const condition = request.nextUrl.searchParams.get('condition') || 'Emergency case';
		const severity = request.nextUrl.searchParams.get('severity') || 'Critical / Level 1';
		const resource = request.nextUrl.searchParams.get('resource') || 'ICU Bed + Ventilator';

		const center = CITY_CENTER[city] || CITY_CENTER.Indore;
		const originLat = Number.isFinite(latParam) ? latParam : center.lat;
		const originLng = Number.isFinite(lngParam) ? lngParam : center.lng;

		const hospitalSeed = CITY_HOSPITALS[city] || CITY_HOSPITALS.Indore;
		const ranked: HospitalMatch[] = hospitalSeed
			.map((item) => {
				const lat = center.lat + item.latOffset;
				const lng = center.lng + item.lngOffset;
				const distanceKm = Number(haversineKm(originLat, originLng, lat, lng).toFixed(1));
				const etaMin = estimateEta(distanceKm);
				const score = Math.max(55, Math.round(100 - distanceKm * 5 + item.icu * 1.5));

				return {
					id: item.id,
					name: item.name,
					lat,
					lng,
					score,
					distanceKm,
					etaMin,
					routeStatus: etaMin <= 10 ? 'Smooth traffic' : etaMin <= 15 ? 'Moderate traffic' : 'Heavy traffic',
					workloadBadge: item.load,
					aiReason: `${resource} prioritized for ${condition.toLowerCase()} (${severity}).`,
					resource: {
						icuAvailable: item.icu,
						ventilatorAvailable: item.vent,
						doctorAvailable: item.docs,
						oxygenPct: item.oxygen,
					},
				};
			})
			.sort((a, b) => b.score - a.score);

		const bestHospital = ranked[0];
		const alternatives = ranked.slice(1);

		return NextResponse.json({
			city,
			generatedAt: new Date().toISOString(),
			ai: {
				used: true,
				model: 'medlink-city-fallback-v1',
				summary: `Best match selected in ${city} based on route, ICU availability, and ${resource.toLowerCase()} priority.`,
			},
			bestHospital,
			alternatives,
			route: {
				distanceKm: bestHospital.distanceKm,
				etaMin: bestHospital.etaMin,
				geometry: [
					[originLng, originLat],
					[bestHospital.lng, bestHospital.lat],
				],
			},
		});
	} catch (error) {
		console.error('Finder match error', error);
		return NextResponse.json({ error: 'Unable to generate finder match.' }, { status: 500 });
	}
}
