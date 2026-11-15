import { NextResponse } from 'next/server';
import { listEvents } from '@/features/events/lib/event-data';

export const dynamic='force-dynamic';
export async function GET() {
  const result=await listEvents();
  return NextResponse.json(result,{status:result.available?200:503,headers:{'Cache-Control':'no-store'}});
}
