import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INDORE_PREDICTIONS } from '@/lib/fake/indore';

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
      return NextResponse.json(INDORE_PREDICTIONS);
    }

    if (!supabase) {
      return NextResponse.json([
        {
          id: 1,
          title: `ICU Overload Risk - ${city}`,
          description: `ICU capacity may reach 90% in ${city} if emergency load increases.`,
          type: 'critical',
        },
        {
          id: 2,
          title: `High Ambulance Traffic - ${city}`,
          description: `Elevated transit demand expected in ${city} over the next 2 hours.`,
          type: 'warning',
        },
      ]);
    }

    const { data: hospitals } = await supabase.from('hospitals').select('*');
    const cityHospitalIds = new Set(
      (hospitals || [])
        .filter((hospital: any) => haversineKm(center.lat, center.lng, Number(hospital.lat), Number(hospital.lng)) <= 90)
        .map((hospital: any) => hospital.id)
    );

    // Determine dynamic predictions based on current DB state
    const { data: resources } = await supabase.from('resource_status').select('icu, hospital_id');
    const predictions = [];

    let highestIcu = 0;
    if (resources) {
        for (const res of resources.filter((item: any) => cityHospitalIds.has(item.hospital_id))) {
            const pct = (res.icu.used / res.icu.total) * 100;
            if (pct > highestIcu) highestIcu = pct;
        }
    }

    if (highestIcu > 85) {
        predictions.push({
            id: 1,
          title: `ICU Overload Risk - ${city}`,
          description: `ICU capacity may reach 95% across major hospitals in ${city} within 4 hours.`,
            type: 'critical'
        });
    }

    predictions.push({
        id: 2,
        title: `High Ambulance Traffic - ${city}`,
        description: `Elevated demand for transit expected in ${city} based on traffic patterns.`,
        type: 'warning'
    });
    
    predictions.push({
        id: 3,
        title: "Staffing Optimization",
        description: `Recommend shifting 2 standby ER doctors to the busiest ${city} care cluster.`,
        type: 'info'
    });

    return NextResponse.json(predictions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
