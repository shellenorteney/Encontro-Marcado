import { validate, compatibility, visibleMatch, digest, newToken, InputError } from './domain.mjs';
import {mailMessage,mailAccessToken} from './mail.mjs';
const env = (name: string) => Deno.env.get(name);
const base = env('SUPABASE_URL')!;
const secret = env('SUPABASE_SERVICE_ROLE_KEY')!;
const mailReady = () => !!(env('RESEND_API_KEY') && env('MAIL_FROM'));
async function rpc(data: Record<string,unknown>) {
 const r=await fetch(`${base}/rest/v1/rpc/connection_rpc`,{method:'POST',headers:{apikey:secret,Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
 const result=await r.json();
 if (!r.ok) {
  if (result.message==='session_invalid') throw new InputError('Código de acesso inválido ou expirado.');
  if (result.message==='rate_limit') throw new InputError('Limite de cadastros nesta rede. Tente novamente em uma hora.');
  throw new Error('Database operation failed');
 }
 return result;
}
async function sendPending() {
 if (!mailReady()) return;
 const queue=await rpc({p_action:'mail_claim'});
 for (const item of queue) {
  const access=await mailAccessToken(secret,item.recipient);
  await rpc({p_action:'mail_access',p_target:item.recipient,p_source:await digest(access)});
  const link=`https://encontro-marcado-conexoes.slowgenet.chatgpt.site/#access=${access}&match=${item.partner}`;
  const message=mailMessage(item,link);
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env('RESEND_API_KEY')}`,'Content-Type':'application/json','Idempotency-Key':`${item.kind}-${item.recipient}-${item.partner}`},body:JSON.stringify({from:env('MAIL_FROM'),to:[item.email],...message}),signal:AbortSignal.timeout(10000)});
  if (r.ok) await rpc({p_action:'mail_sent',p_source:item.recipient,p_target:item.partner,p_profile:{kind:item.kind}});
 }
}
Deno.serve(async req => {
 const origin=req.headers.get('origin');
 const allowed=!origin || origin==='https://shellenorteney.github.io' || origin==='https://encontro-marcado-conexoes.slowgenet.chatgpt.site' || /^http:\/\/(localhost|127\.0\.0\.1):3000$/.test(origin);
 const headers:Record<string,string>={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if (origin && allowed) Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'});
 const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if (!allowed) return json({error:'Origem não autorizada.'},403);
 if (req.method==='OPTIONS') return new Response(null,{status:204,headers});
 if (req.method!=='POST') return json({error:'Método não permitido.'},405);
 try {
  if (!req.headers.get('content-type')?.startsWith('application/json')) return json({error:'Envie JSON.'},415);
  const reader=req.body?.getReader(); if (!reader) return json({error:'Dados ausentes.'},400);
  const chunks=[]; let size=0;
  while (true) {const {value,done}=await reader.read(); if(done)break; size+=value.length; if(size>350000){await reader.cancel(); return json({error:'Foto ou perfil muito grande.'},413);} chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return json({error:'JSON inválido.'},400);}
  if (!body || typeof body!=='object') return json({error:'Dados inválidos.'},400);
  if (body.action==='status') return json({ready:true,emailConfigured:mailReady(),questionnaireVersion:'choices-v2'});
  if (!['register','me','matches','accept','delete'].includes(body.action)) return json({error:'Ação inválida.'},400);
  let token, snapshot;
  if (body.action==='register') {
   const profile=validate(body.profile);token=newToken();
   const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
   snapshot=await rpc({p_action:'register',p_hash:await digest(token),p_profile:profile,p_source:await digest(secret+ip)});
  } else {
   token=/^Bearer ([0-9a-f]{64})$/.exec(req.headers.get('authorization')||'')?.[1];
   if(!token)return json({error:'Informe seu código de acesso.'},401);
   snapshot=await rpc({p_action:'me',p_hash:await digest(token)});
  }
  const hash=await digest(token);
  if (body.action==='delete') {await rpc({p_action:'delete',p_hash:hash});return json({deleted:true});}
  if(body.action==='accept') {
   const candidate=snapshot.candidates.find((c:any)=>c.profile.id===body.matchId);
   if(!candidate || !compatibility(snapshot.profile,candidate.profile))return json({error:'Match indisponível.'},404);
   snapshot=await rpc({p_action:'accept',p_hash:hash,p_target:body.matchId});
  }
  const matches=snapshot.candidates.map((c:any)=>visibleMatch(snapshot.profile,c.profile,c.accepted,c.partnerAccepted)).filter(Boolean).sort((a:any,b:any)=>b.score-a.score);
  // Saving/returning the profile must not depend on notification delivery.
  const notify=async()=>{for(const match of matches)await rpc({p_action:'enqueue',p_hash:hash,p_target:match.id});await sendPending();};
  EdgeRuntime.waitUntil(notify().catch(()=>console.error('connection-v2: notifications pending')));
  const emailDispatch=mailReady()?'queued':'not_configured';
  return json({...(body.action==='register'?{token}:{}),profile:snapshot.profile,matches,emailConfigured:mailReady(),emailDispatch},body.action==='register'?201:200);
 } catch(error) {
  if(error instanceof InputError)return json({error:error.message},400);
  console.error('connection-v2: operation failed');return json({error:'Não foi possível concluir. Seus dados só são confirmados após a resposta do servidor. Tente novamente.'},500);
 }
});
