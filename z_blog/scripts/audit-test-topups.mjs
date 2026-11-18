import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const env={...parseEnv(await readFile(new URL('../.env.local',import.meta.url),'utf8')),...process.env};
if(!env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw new Error('This read-only audit requires a TEST key.');
const admin=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const sandbox=admin.schema('stardust_sandbox');
const stripe=new Stripe(env.STRIPE_SECRET_KEY,{timeout:15000,maxNetworkRetries:0});
const {data:orders,error}=await sandbox.from('stardust_topups').select('id,user_id,amount_cents,status,session_id,payment_intent,created_at,paid_at').order('created_at',{ascending:false}).limit(5);
if(error)throw new Error(`Unable to read sandbox orders: ${error.code}`);
if(!orders.length)console.log('No sandbox top-up orders found.');
for(const order of orders) {
  const {data:wallet,error:walletError}=await sandbox.from('stardust_wallets').select('paid,reward,blocked').eq('user_id',order.user_id).single();
  const {data:ledger,error:ledgerError}=await sandbox.from('stardust_ledger').select('kind,paid_delta,reward_delta').eq('user_id',order.user_id).eq('kind','topup').eq('reference',order.id);
  if(walletError||ledgerError)throw new Error('Unable to reconcile sandbox wallet and ledger.');
  let payment=null;
  if(order.session_id) {
    const session=await stripe.checkout.sessions.retrieve(order.session_id);
    payment={test:!session.livemode,status:session.status,paymentStatus:session.payment_status,amountCents:session.amount_total,currency:session.currency,userMatches:session.client_reference_id===order.user_id,orderMatches:session.metadata?.order_id===order.id,intentMatches:session.payment_intent===order.payment_intent};
  }
  const {data:productionTopup,error:productionError}=await admin.from('stardust_topups').select('id').eq('id',order.id).maybeSingle();
  if(productionError)throw new Error('Unable to check live-ledger isolation.');
  console.log(JSON.stringify({order:order.id,amountAUD:order.amount_cents/100,status:order.status,paidAt:order.paid_at,wallet,topupLedgerEntries:ledger.length,topupLedger:ledger,payment,orderAbsentFromProduction:!productionTopup}));
}
