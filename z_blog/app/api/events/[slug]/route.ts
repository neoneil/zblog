import { NextResponse } from 'next/server';
import { getEvent } from '@/features/events/lib/event-data';

export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const result=await getEvent(slug);
  return NextResponse.json(result,{status:!result.available?503:!result.event?404:200,headers:{'Cache-Control':'no-store'}});
}
