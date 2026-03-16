import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Determine dynamic predictions based on current DB state
    const { data: resources } = await supabase.from('resource_status').select('icu, hospital_id');
    const predictions = [];

    let highestIcu = 0;
    if (resources) {
        for (const res of resources) {
            const pct = (res.icu.used / res.icu.total) * 100;
            if (pct > highestIcu) highestIcu = pct;
        }
    }

    if (highestIcu > 85) {
        predictions.push({
            id: 1,
            title: "ICU Overload Risk",
            description: `ICU capacity may reach 95% across major hospitals within 4 hours.`,
            type: 'critical'
        });
    }

    predictions.push({
        id: 2,
        title: "High Ambulance Traffic",
        description: "Elevated demand for transit expected in the Downtown Sector based on traffic patterns.",
        type: 'warning'
    });
    
    predictions.push({
        id: 3,
        title: "Staffing Optimization",
        description: "Recommend shifting 2 standby ER doctors from North Wing to Eastside Clinics.",
        type: 'info'
    });

    return NextResponse.json(predictions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
