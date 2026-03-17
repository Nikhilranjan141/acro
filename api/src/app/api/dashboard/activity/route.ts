import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json([
        {
          id: 'fallback-act-1',
          type: 'SYSTEM',
          message: 'Backend running in fallback mode (Supabase not configured).',
          severity: 'info',
          created_at: new Date().toISOString(),
        },
        {
          id: 'fallback-act-2',
          type: 'TRANSFER',
          message: 'Transfer queue synchronized from fallback dataset.',
          severity: 'warning',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
