import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INDORE_TRANSFERS } from '@/lib/fake/indore';

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

    if (city === 'Indore') {
      return NextResponse.json(INDORE_TRANSFERS);
    }

    if (!supabase) {
      return NextResponse.json([
        {
          id: 'fallback-tr-1',
          patient_code: 'PT-1033',
          from_hospital: `${city} Eastside Medical`,
          to_hospital: `${city} Central Care`,
          status: 'IN_TRANSIT',
          eta_min: 12,
          updated_at: new Date().toISOString(),
        },
        {
          id: 'fallback-tr-2',
          patient_code: 'PT-1042',
          from_hospital: `${city} General Unit`,
          to_hospital: `${city} North Wing`,
          status: 'ACCEPTED',
          eta_min: 18,
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    const { data: hospitals } = await supabase.from('hospitals').select('name,lat,lng');
    const cityHospitals = (hospitals || []).filter((hospital: any) => haversineKm(center.lat, center.lng, Number(hospital.lat), Number(hospital.lng)) <= 90);
    const cityHospitalNameTokens = cityHospitals.flatMap((hospital: any) =>
      String(hospital.name || '')
        .toLowerCase()
        .split(/\s+/)
        .filter((token: string) => token.length >= 4)
    );

    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    const filteredTransfers = (data || []).filter((transfer: any) => {
      const from = String(transfer.from_hospital || '').toLowerCase();
      const to = String(transfer.to_hospital || '').toLowerCase();
      return cityHospitalNameTokens.some((token: string) => from.includes(token) || to.includes(token));
    });

    return NextResponse.json(filteredTransfers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
