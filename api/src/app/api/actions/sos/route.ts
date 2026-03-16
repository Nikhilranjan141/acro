import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const bodySchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = bodySchema.parse(json);

    // Create an Emergency
    const { data: emergency, error: emErr } = await supabase.from('emergencies').insert({
      severity: 'Critical',
      lat: body.lat || 19.0760,
      lng: body.lng || 72.8777,
      status: 'Active'
    }).select().single();

    if (emErr) throw emErr;

    // Create Audit Log
    const { data: audit, error: audErr } = await supabase.from('audit_log').insert({
      type: 'SOS',
      message: `Emergency SOS triggered at coordinates [${emergency.lat}, ${emergency.lng}]`,
      severity: 'red',
      meta_json: { emergency_id: emergency.id }
    }).select().single();

    if (audErr) throw audErr;

    // *Note: In a true prod Next.js + Socket architecture we'd hit the Socket API endpoint 
    // internally or use Redis pub/sub. For this mock, the frontend will refetch or the simulator 
    // will catch it. To trigger an immediate broadcast, we typically do a fetch to the Next Pages api/socket

    return NextResponse.json({ success: true, audit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
