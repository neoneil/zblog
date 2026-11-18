import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { createClient } from '@supabase/supabase-js';

const file=fileURLToPath(new URL('../.env.local',import.meta.url));
const source=await readFile(file,'utf8');
const env={...parseEnv(source),...process.env};
if(!env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw new Error('Only Stripe TEST keys are accepted.');
const origin=new URL(env.NEXT_PUBLIC_SITE_URL||'');
if(!['localhost','127.0.0.1'].includes(origin.hostname))throw new Error('Only a localhost site origin is accepted.');
if(!env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'))throw new Error('Missing webhook signature configuration.');
const admin=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const db=admin.schema('stardust_sandbox');
const tables=['stardust_settings','stardust_wallets','stardust_topups','stardust_memberships','stardust_allowances','stardust_access','stardust_requests','stardust_ledger','stardust_webhooks','stardust_mail'];
let failed=false;
for(const table of tables) {
  const {error}=await db.from(table).select('*',{head:true}).limit(1);
  if(error){console.error(`FAIL ${table}: ${error.code||'Data API error'}`);failed=true;}
  else console.log(`PASS sandbox Data API access: ${table}`);
}
if(failed){process.exitCode=1;console.error('Checkout remains unchanged. Check the sandbox migration and Exposed schemas.');}
else if(process.argv.includes('--enable')) {
  const pattern=/^\s*(?:export\s+)?STARDUST_CHECKOUT_ENABLED\s*=.*$/m;
  const updated=pattern.test(source)?source.replace(pattern,'STARDUST_CHECKOUT_ENABLED=true'):`${source.trimEnd()}\nSTARDUST_CHECKOUT_ENABLED=true\n`;
  const temporary=`${file}.test-${process.pid}`;
  await writeFile(temporary,updated,{mode:0o600});
  await rename(temporary,file);
  console.log('Local TEST checkout enabled. No wallet, order or payment was created by this script.');
}else console.log('Sandbox schema verified using read-only queries. Checkout flag unchanged.');
