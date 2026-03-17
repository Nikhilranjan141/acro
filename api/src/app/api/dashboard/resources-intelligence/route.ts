import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type FacilityStatus = 'Stable' | 'Warning' | 'Critical';
type BloodLevel = 'Adequate' | 'Low' | 'Depleted';
type Zone = 'North' | 'Central' | 'East' | 'South' | 'West';

type Facility = {
  name: string;
  icuAvailable: number;
  icuTotal: number;
  ventilators: number;
  blood: BloodLevel;
  status: FacilityStatus;
  zone: Zone;
};

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Indore: { lat: 22.7196, lng: 75.8577 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Ujjain: { lat: 23.1765, lng: 75.7885 },
};

const FALLBACK_BY_CITY: Record<string, { facilities: Facility[]; doctorsOnDuty: number; ambulancesReady: number; alerts: { capacity: string; reallocation: string; oxygen: string } }> = {
  Indore: {
    facilities: [
      { name: 'Indore Central Hospital', icuAvailable: 12, icuTotal: 32, ventilators: 6, blood: 'Adequate', status: 'Stable', zone: 'Central' },
      { name: 'Eastside Medical Centre', icuAvailable: 8, icuTotal: 24, ventilators: 4, blood: 'Low', status: 'Warning', zone: 'East' },
      { name: 'North Wing General Hospital', icuAvailable: 4, icuTotal: 20, ventilators: 2, blood: 'Low', status: 'Warning', zone: 'North' },
      { name: 'CHL Health Campus', icuAvailable: 5, icuTotal: 26, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'South' },
    ],
    doctorsOnDuty: 46,
    ambulancesReady: 15,
    alerts: {
      capacity: 'Indore South District is operating at 95% total capacity.',
      reallocation: 'AI suggests moving 4 unused units from East Wing to ER.',
      oxygen: 'Eastside Clinic projected below safe threshold in 40 mins.',
    },
  },
  Bhopal: {
    facilities: [
      { name: 'Bhopal Central Trauma Care', icuAvailable: 10, icuTotal: 28, ventilators: 5, blood: 'Adequate', status: 'Stable', zone: 'Central' },
      { name: 'JP Hospital Bhopal', icuAvailable: 5, icuTotal: 22, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'East' },
      { name: 'AIIMS Bhopal Emergency Block', icuAvailable: 8, icuTotal: 24, ventilators: 4, blood: 'Adequate', status: 'Stable', zone: 'North' },
      { name: 'Hamidia Hospital Bhopal', icuAvailable: 2, icuTotal: 18, ventilators: 1, blood: 'Depleted', status: 'Critical', zone: 'West' },
    ],
    doctorsOnDuty: 38,
    ambulancesReady: 12,
    alerts: {
      capacity: 'Bhopal central trauma lane is nearing 90% critical-care occupancy.',
      reallocation: 'Move 3 ventilators from JP block to Hamidia emergency lane.',
      oxygen: 'Hamidia reserve may fall below safe threshold in 55 mins.',
    },
  },
  Ujjain: {
    facilities: [
      { name: 'Ujjain District Hospital', icuAvailable: 7, icuTotal: 20, ventilators: 3, blood: 'Adequate', status: 'Stable', zone: 'Central' },
      { name: 'R D Gardi Medical College', icuAvailable: 4, icuTotal: 16, ventilators: 2, blood: 'Low', status: 'Warning', zone: 'North' },
      { name: 'Civil Hospital Ujjain', icuAvailable: 5, icuTotal: 18, ventilators: 3, blood: 'Low', status: 'Warning', zone: 'East' },
      { name: 'Mahakal Trauma Unit', icuAvailable: 1, icuTotal: 12, ventilators: 1, blood: 'Depleted', status: 'Critical', zone: 'West' },
    ],
    doctorsOnDuty: 29,
    ambulancesReady: 9,
    alerts: {
      capacity: 'Ujjain district intake rising during late-evening surge window.',
      reallocation: 'Shift 2 support units from Civil Hospital to trauma unit.',
      oxygen: 'Mahakal Trauma Unit reserve risk expected in 35 mins.',
    },
  },
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

function zoneFromIndex(index: number): Zone {
  const zones: Zone[] = ['North', 'Central', 'East', 'South', 'West'];
  return zones[index % zones.length];
}

function createForecastPayload(
  city: string,
  facilities: Facility[],
  doctorsOnDuty: number,
  ambulancesReady: number,
  horizon: number
) {
  const avgUtilization = Math.round(
    (facilities.reduce((sum, item) => sum + (item.icuTotal - item.icuAvailable) / Math.max(1, item.icuTotal), 0) /
      Math.max(1, facilities.length)) *
      100
  );

  const criticalCount = facilities.filter((item) => item.status === 'Critical').length;
  const warningCount = facilities.filter((item) => item.status === 'Warning').length;
  const demandPressure = criticalCount * 7 + warningCount * 4;
  const points = horizon <= 6 ? 6 : 8;
  const growthStep = horizon <= 6 ? 2 : 3;

  const createSeries = (base: number, modifier: number) =>
    Array.from({ length: points }, (_, index) => {
      const value = base + modifier + index * growthStep + (index % 2 === 0 ? 1 : 3);
      return Math.max(18, Math.min(96, value));
    });

  const icuSeries = createSeries(avgUtilization - 12, demandPressure);
  const ventSeries = createSeries(38 + criticalCount * 3, demandPressure - 6);
  const ambulanceSeries = createSeries(36 + Math.round((ambulancesReady / 20) * 30), demandPressure - 4);

  const confidence = Math.max(68, Math.min(94, 90 - criticalCount * 8 - warningCount * 3));
  const recommendation =
    criticalCount > 0
      ? `Prioritize ${city} critical zones with rapid ventilator redistribution and reserve ambulance cover.`
      : `Maintain proactive staffing rotation and keep one standby transfer unit in ${city} core corridor.`;

  return {
    horizonHours: horizon <= 6 ? 6 : 12,
    icuSeries,
    ventSeries,
    ambulanceSeries,
    confidence,
    recommendation,
    doctorsOnDuty,
  };
}

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get('city') || 'Indore';
    const horizonParam = Number(request.nextUrl.searchParams.get('horizon') || 6);
    const horizon = horizonParam === 12 ? 12 : 6;
    const center = CITY_COORDS[city] || CITY_COORDS.Indore;
    const fallback = FALLBACK_BY_CITY[city] || FALLBACK_BY_CITY.Indore;

    if (!supabase) {
      return NextResponse.json({
        city,
        source: 'fallback',
        generatedAt: new Date().toISOString(),
        facilities: fallback.facilities,
        alerts: fallback.alerts,
        totals: {
          doctorsOnDuty: fallback.doctorsOnDuty,
          ambulancesReady: fallback.ambulancesReady,
        },
        forecast: createForecastPayload(city, fallback.facilities, fallback.doctorsOnDuty, fallback.ambulancesReady, horizon),
      });
    }

    const { data: hospitals } = await supabase.from('hospitals').select('*');
    const cityHospitals = (hospitals || []).filter((hospital: any) => {
      const distance = haversineKm(center.lat, center.lng, Number(hospital.lat), Number(hospital.lng));
      return Number.isFinite(distance) && distance <= 90;
    });

    const hospitalIds = new Set(cityHospitals.map((hospital: any) => hospital.id));

    const { data: allResources } = await supabase.from('resource_status').select('*');
    const resources = (allResources || []).filter((resource: any) => hospitalIds.has(resource.hospital_id));

    if (cityHospitals.length === 0 || resources.length === 0) {
      return NextResponse.json({
        city,
        source: 'fallback',
        generatedAt: new Date().toISOString(),
        facilities: fallback.facilities,
        alerts: fallback.alerts,
        totals: {
          doctorsOnDuty: fallback.doctorsOnDuty,
          ambulancesReady: fallback.ambulancesReady,
        },
        forecast: createForecastPayload(city, fallback.facilities, fallback.doctorsOnDuty, fallback.ambulancesReady, horizon),
      });
    }

    const byHospitalId = new Map(resources.map((resource: any) => [resource.hospital_id, resource]));

    const facilities: Facility[] = cityHospitals
      .map((hospital: any, index: number) => {
        const resource = byHospitalId.get(hospital.id);
        if (!resource) return null;

        const icuTotal = Number(resource.icu?.total || 0);
        const icuUsed = Number(resource.icu?.used || 0);
        const icuAvailable = Math.max(0, icuTotal - icuUsed);

        const ventTotal = Number(resource.ventilators?.total || 0);
        const ventUsed = Number(resource.ventilators?.used || 0);
        const ventilators = Math.max(0, ventTotal - ventUsed);

        const oxygen = Number(resource.oxygen_pct || 0);
        const utilizationPct = icuTotal > 0 ? Math.round((icuUsed / icuTotal) * 100) : 0;

        const status: FacilityStatus = utilizationPct >= 90 || oxygen < 35 ? 'Critical' : utilizationPct >= 75 || oxygen < 60 ? 'Warning' : 'Stable';
        const blood: BloodLevel = oxygen < 35 ? 'Depleted' : oxygen < 60 ? 'Low' : 'Adequate';

        return {
          name: String(hospital.name || `Hospital ${index + 1}`),
          icuAvailable,
          icuTotal,
          ventilators,
          blood,
          status,
          zone: zoneFromIndex(index),
        };
      })
      .filter(Boolean) as Facility[];

    let doctorsOnDuty = 0;
    resources.forEach((resource: any) => {
      doctorsOnDuty += Number(resource.doctors?.available || 0);
    });

    const { data: allAmbulances } = await supabase.from('ambulances').select('*');
    const ambulancesReady = (allAmbulances || []).filter((ambulance: any) => {
      const distance = haversineKm(center.lat, center.lng, Number(ambulance.lat), Number(ambulance.lng));
      return Number.isFinite(distance) && distance <= 90 && String(ambulance.status || '').toLowerCase() === 'available';
    }).length;

    const criticalCount = facilities.filter((facility) => facility.status === 'Critical').length;
    const warningCount = facilities.filter((facility) => facility.status === 'Warning').length;

    const alerts = {
      capacity:
        criticalCount > 0
          ? `${city} critical-care lane has ${criticalCount} facility under high pressure.`
          : `${city} network capacity is stable with no critical ICU overload.`,
      reallocation:
        warningCount > 0
          ? `Reallocate ${Math.max(1, warningCount)} ventilator unit(s) toward warning zones for safer coverage.`
          : `Keep current ventilator distribution and monitor demand trend every 30 mins.`,
      oxygen:
        facilities.some((facility) => facility.blood === 'Depleted')
          ? `${city} has immediate oxygen replenishment risk in at least one facility.`
          : `${city} oxygen reserves are within acceptable threshold with watch monitoring active.`,
    };

    return NextResponse.json({
      city,
      source: 'supabase',
      generatedAt: new Date().toISOString(),
      facilities: facilities.length > 0 ? facilities : fallback.facilities,
      alerts,
      totals: {
        doctorsOnDuty: doctorsOnDuty || fallback.doctorsOnDuty,
        ambulancesReady: ambulancesReady || fallback.ambulancesReady,
      },
      forecast: createForecastPayload(
        city,
        facilities.length > 0 ? facilities : fallback.facilities,
        doctorsOnDuty || fallback.doctorsOnDuty,
        ambulancesReady || fallback.ambulancesReady,
        horizon
      ),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to compute resource intelligence.' }, { status: 500 });
  }
}
