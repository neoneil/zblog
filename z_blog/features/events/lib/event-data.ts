import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { EventRecord } from './events';

const fields='id,slug,title_zh,title_en,description_zh,description_en,starts_at,ends_at,timezone,location_zh,location_en,price_cents,capacity,booked_count,registration_open,is_published,is_demo';

export async function listEvents():Promise<{events:EventRecord[];available:boolean}> {
  try {
    const supabase=await createClient();
    const {data,error}=await supabase.from('events').select(fields).eq('is_published',true)
      .gt('ends_at',new Date().toISOString()).order('starts_at',{ascending:true}).limit(100);
    if (error) return {events:[],available:false};
    return {events:(data??[]) as EventRecord[],available:true};
  } catch {return {events:[],available:false};}
}

export async function getEvent(slug:string):Promise<{event:EventRecord|null;available:boolean;checkedAt:number}> {
  const checkedAt=Date.now();
  try {
    const supabase=await createClient();
    const {data,error}=await supabase.from('events').select(fields).eq('slug',slug).eq('is_published',true).maybeSingle();
    if (error) return {event:null,available:false,checkedAt};
    return {event:data as EventRecord|null,available:true,checkedAt};
  } catch {return {event:null,available:false,checkedAt};}
}
