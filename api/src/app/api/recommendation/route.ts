import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const severity = searchParams.get('severity') || 'Critical';

    // Mock Location (e.g. downtown) if not provided
    const lat = latStr ? parseFloat(latStr) : 19.0760;
    const lng = lngStr ? parseFloat(lngStr) : 72.8777;

    if (!supabase) {
      return NextResponse.json({
        id: 'fallback-hospital',
        name: 'Central Command Hospital',
        distance_km: '4.8',
        icu_available: severity.toLowerCase().includes('critical') ? 3 : 7,
        eta_mins: 14,
        workload_badge: 'Fallback recommendation',
      });
    }

    const { data: hospitals } = await supabase.from('hospitals').select('*, resource_status(icu, doctors)');

    if (!hospitals || hospitals.length === 0) {
        return NextResponse.json({ message: "No hospitals available" }, { status: 404 });
    }

    let bestHosp = null;
    let bestScore = -1;

    for (const h of hospitals) {
        const icu = h.resource_status?.[0]?.icu;
        const icuAvail = icu ? icu.total - icu.used : 0;
        
        // Very basic mock score: Close distance + high ICU = better
        const dist = getDistanceFromLatLonInKm(lat, lng, Number(h.lat), Number(h.lng));
        const distanceScore = Math.max(0, 100 - (dist * 10)); // drop 10 points per km
        const bedScore = icuAvail * 5; // 5 points per bed

        const score = distanceScore + bedScore;

        if (score > bestScore && icuAvail > 0) {
            bestScore = score;
            bestHosp = {
                id: h.id,
                name: h.name,
                distance_km: dist.toFixed(1),
                icu_available: icuAvail,
                eta_mins: Math.ceil(dist * 3), // assume 3 min per km in traffic
                workload_badge: `Score: ${score.toFixed(0)}`
            };
        }
    }
    
    // Fallback if everyone is full
    if (!bestHosp) {
         bestHosp = {
             id: hospitals[0].id,
             name: hospitals[0].name,
             distance_km: getDistanceFromLatLonInKm(lat, lng, Number(hospitals[0].lat), Number(hospitals[0].lng)).toFixed(1),
             icu_available: 0,
             eta_mins: 15,
             workload_badge: 'OVERLOADED'
         };
    }

    return NextResponse.json(bestHosp);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
