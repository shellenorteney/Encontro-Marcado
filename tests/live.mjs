// Explicit integration test; creates only synthetic records and deletes them in finally.
import assert from 'node:assert/strict';import {fixture} from './domain.test.mjs';
const endpoint='https://kcejmkympweqmfdlglaz.supabase.co/functions/v1/connection-v2';
async function call(action,token,extra={}){const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://shellenorteney.github.io',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({action,...extra})});const data=await r.json();if(!r.ok)throw Error(`${r.status}: ${data.error}`);return data;}
const tokens=[];
try{
 const status=await call('status');console.log('Backend reachable; emailConfigured='+status.emailConfigured);
 const a=await call('register',null,{profile:fixture({name:'QA sintético A',email:'qa-a@example.invalid'})});tokens.push(a.token);
 const b=await call('register',null,{profile:fixture({name:'QA sintético B',gender:'homem',seeking:'mulher',email:'qa-b@example.invalid'})});tokens.push(b.token);
 assert.ok(b.matches.some(m=>m.id===a.profile.id));
 let sa=await call('me',a.token);let m=sa.matches.find(m=>m.id===b.profile.id);assert.equal(m.score,100);assert.equal(m.partner.email,undefined);
 sa=await call('accept',a.token,{matchId:b.profile.id});m=sa.matches.find(m=>m.id===b.profile.id);assert.equal(m.accepted,true);assert.equal(m.mutual,false);assert.equal(m.partner.email,undefined);
 let sb=await call('matches',b.token);assert.equal(sb.matches.find(m=>m.id===a.profile.id).partner.email,undefined);
 sb=await call('accept',b.token,{matchId:a.profile.id});assert.equal(sb.matches.find(m=>m.id===a.profile.id).partner.email,'qa-a@example.invalid');
 sa=await call('matches',a.token);assert.equal(sa.matches.find(m=>m.id===b.profile.id).partner.email,'qa-b@example.invalid');
 const bad=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'me'})});assert.equal(bad.status,401);
 console.log('PASS: shared persistence, restored session, 100% match, bilateral consent, contact privacy and unauthorized access.');
}finally{for(const token of tokens)await call('delete',token);console.log('Synthetic profiles deleted.');}
