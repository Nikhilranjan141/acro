import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const bodySchema = z.object({
  ambulance_id: z.string().uuid()
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = bodySchema.parse(json);

    // Update Ambulance Status
    const { data: ambulance, error: ambErr } = await supabase
      .from('ambulances')
      .update({ status: 'Responding', updated_at: new Date().toISOString() })
      .eq('id', body.ambulance_id)
      .select().single();

    if (ambErr) throw ambErr;

    // Create Audit Log
    const { data: audit, error: audErr } = await supabase.from('audit_log').insert({
      type: 'DISPATCH',
      message: `Ambulance ${ambulance.code} manually dispatched.`,
      severity: 'teal',
      meta_json: { ambulance_id: ambulance.id }
    }).select().single();

    if (audErr) throw audErr;

    return NextResponse.json({ success: true, audit, ambulance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
