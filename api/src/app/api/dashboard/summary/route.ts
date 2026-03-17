import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Indore: { lat: 22.7196, lng: 75.8577 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Ujjain: { lat: 23.1765, lng: 75.7885 },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get('city') || 'Indore';
    const center = CITY_COORDS[city] || CITY_COORDS.Indore;

    if (!supabase) {
      return NextResponse.json({
        kpis: {
          activeEmergencies: 2,
          ambulancesActive: 3,
          icuAvailable: 12,
          doctorsAvailable: 17,
          oxygenAvg: 78,
        },
        resources: [],
        hospitals: [],
        ambulances: [],
        source: 'fallback',
      });
    }
    
    // Aggregate ICU and Doctors from resource_status
    let icuTotal = 0;
    let icuUsed = 0;
    let docTotal = 0;
    let docAvailable = 0;
    let oxySum = 0;
    
    const { data: hospitals } = await supabase.from('hospitals').select('*');
    const filteredHospitals = (hospitals || []).filter((hospital: any) => {
      const distance = haversineKm(center.lat, center.lng, Number(hospital.lat), Number(hospital.lng));
      return Number.isFinite(distance) && distance <= 90;
    });
    const hospitalIds = new Set(filteredHospitals.map((hospital: any) => hospital.id));

    const { data: allResources } = await supabase.from('resource_status').select('*');
    const resources = (allResources || []).filter((resource: any) => hospitalIds.has(resource.hospital_id));
    resources.forEach((r: any) => {
      icuTotal += r.icu.total;
      icuUsed += r.icu.used;
      docTotal += r.doctors.total;
      docAvailable += r.doctors.available;
      oxySum += Number(r.oxygen_pct);
    });

    const { data: allAmbulances } = await supabase.from('ambulances').select('*');
    const ambulances = (allAmbulances || []).filter((ambulance: any) => {
      const distance = haversineKm(center.lat, center.lng, Number(ambulance.lat), Number(ambulance.lng));
      return Number.isFinite(distance) && distance <= 90;
    });

    const { data: allEmergencies } = await supabase.from('emergencies').select('*').eq('status', 'Active');
    const activeEmergencies = (allEmergencies || []).filter((emergency: any) => {
      const distance = haversineKm(center.lat, center.lng, Number(emergency.lat), Number(emergency.lng));
      return Number.isFinite(distance) && distance <= 90;
    }).length;

    const ambulancesActive = ambulances.filter((ambulance: any) => ambulance.status !== 'Available').length;
    
    const oxyAvg = resources && resources.length > 0 ? (oxySum / resources.length).toFixed(1) : 0;
    
    const kpis = {
      activeEmergencies: activeEmergencies || 0,
      ambulancesActive: ambulancesActive || 0,
      icuAvailable: icuTotal - icuUsed,
      doctorsAvailable: docAvailable,
      oxygenAvg: Number(oxyAvg),
    };

    return NextResponse.json({
       kpis,
       resources,
       hospitals: filteredHospitals,
       ambulances
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
