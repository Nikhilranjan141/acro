import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Get KPIs
    const { count: activeEmergencies } = await supabase.from('emergencies').select('*', { count: 'exact', head: true }).eq('status', 'Active');
    const { count: ambulancesActive } = await supabase.from('ambulances').select('*', { count: 'exact', head: true }).neq('status', 'Available');
    
    // Aggregate ICU and Doctors from resource_status
    let icuTotal = 0;
    let icuUsed = 0;
    let docTotal = 0;
    let docAvailable = 0;
    let oxySum = 0;
    
    const { data: resources } = await supabase.from('resource_status').select('*');
    if (resources) {
      resources.forEach((r: any) => {
         icuTotal += r.icu.total;
         icuUsed += r.icu.used;
         docTotal += r.doctors.total;
         docAvailable += r.doctors.available;
         oxySum += Number(r.oxygen_pct);
      });
    }
    
    const oxyAvg = resources && resources.length > 0 ? (oxySum / resources.length).toFixed(1) : 0;
    
    const kpis = {
      activeEmergencies: activeEmergencies || 0,
      ambulancesActive: ambulancesActive || 0,
      icuAvailable: icuTotal - icuUsed,
      doctorsAvailable: docAvailable,
      oxygenAvg: Number(oxyAvg),
    };

    const { data: hospitals } = await supabase.from('hospitals').select('*');
    const { data: ambulances } = await supabase.from('ambulances').select('*');

    return NextResponse.json({
       kpis,
       resources: resources || [],
       hospitals: hospitals || [],
       ambulances: ambulances || []
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
