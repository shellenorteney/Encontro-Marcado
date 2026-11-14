export const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdbCiG5nbjdTiGU39DUet_WsK9CniI6_aWuemxML6cEt_L1eg/viewform';
export const QUESTIONS = [
 ['name','Nome Completo'], ['stake','Qual sua Estaca?'], ['ward','Qual sua Ala?'],
 ['age','Qual sua Idade?'], ['profession','Qual a sua profissão?'],
 ['education','Estuda ou estudou alguma coisa?'], ['membership','É membro ou não membro?'],
 ['hobbies','O que você gosta de fazer? Tem algum hobbie?'], ['mission','Fez missão? Se sim, aonde?'],
 ['strengths','Fale 3 pontos fortes seus:'], ['curiosity','1 curiosidade sobre você:'],
 ['pitch','Venda seu peixe (vale mandar cantada barata):'],
];
export class InputError extends Error {}
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
export function hobbyTags(s) { return [...new Set(s.split(/[,;\n]+/).map(normalize).filter(Boolean))]; }
export function validate(input) {
 if (!input || typeof input !== 'object' || Array.isArray(input)) throw new InputError('Perfil inválido.');
 const p = {};
 for (const [key,label] of QUESTIONS) {
  if (key === 'age') continue;
  if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > 1000) throw new InputError(`Confira: ${label} (até 1000 caracteres).`);
  p[key] = input[key].trim();
 }
 for (const key of ['age','minAge','maxAge']) {
  if (!Number.isInteger(input[key]) || input[key] < 18 || input[key] > 99) throw new InputError('Idades: use números inteiros entre 18 e 99.');
  p[key] = input[key];
 }
 if (p.minAge > p.maxAge) throw new InputError('Confira a faixa etária desejada.');
 for (const key of ['gender','seeking']) {
  if (!['homem','mulher','qualquer'].includes(input[key]) || (key==='gender' && input[key]==='qualquer')) throw new InputError('Confira as preferências de conexão.');
  p[key] = input[key];
 }
 for (const key of ['member','servedMission']) {
  if (typeof input[key] !== 'boolean') throw new InputError('Responda os campos complementares.');
  p[key]=input[key];
 }
 if (input.consent !== true) throw new InputError('É necessário autorizar o uso dos dados para participar.');
 if (typeof input.email !== 'string' || input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new InputError('Informe um e-mail válido.');
 p.email = input.email.trim().toLowerCase();
 p.consent=true; p.consentVersion='2026-11-14-v1'; p.questionnaireVersion='brooklin-v1';
 if (input.photo) {
  if (typeof input.photo !== 'string' || input.photo.length > 300000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(input.photo)) throw new InputError('Use uma foto JPG reduzida (até 300 KB).');
  let bytes; try { bytes=atob(input.photo.split(',')[1]); } catch { throw new InputError('Foto inválida.'); }
  if (!bytes.startsWith('\xff\xd8\xff')) throw new InputError('Foto JPG inválida.');
  p.photo=input.photo;
 }
 return p;
}
// Open text is never interpreted as psychology. Only explicit hobby tags and
// two structured answers contribute to this transparent, deterministic estimate.
export function compatibility(a,b) {
 if (a.id===b.id || a.questionnaireVersion!==b.questionnaireVersion) return null;
 if ((a.seeking!=='qualquer' && a.seeking!==b.gender) || (b.seeking!=='qualquer' && b.seeking!==a.gender)) return null;
 if (a.age<b.minAge || a.age>b.maxAge || b.age<a.minAge || b.age>a.maxAge) return null;
 const x=hobbyTags(a.hobbies), y=hobbyTags(b.hobbies), common=x.filter(t=>y.includes(t));
 const raw=70*(2*common.length/(x.length+y.length || 1)) + (a.member===b.member?15:0) + (a.servedMission===b.servedMission?15:0);
 if (raw<=70) return null;
 return {score:Math.round(raw*100)/100,common};
}
export function visibleMatch(me,candidate,accepted,partnerAccepted) {
 const result=compatibility(me,candidate); if (!result) return null;
 const mutual=accepted && partnerAccepted;
 const partner={name:candidate.name,age:candidate.age,stake:candidate.stake,profession:candidate.profession,education:candidate.education,hobbies:candidate.hobbies,strengths:candidate.strengths,curiosity:candidate.curiosity,pitch:candidate.pitch};
 if (candidate.photo) partner.photo=candidate.photo;
 if (mutual) partner.email=candidate.email;
 return {id:candidate.id,...result,accepted,mutual,partner};
}
export async function digest(s) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join(''); }
export function newToken() { return [...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join(''); }
