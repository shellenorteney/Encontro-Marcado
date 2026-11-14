export const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdbCiG5nbjdTiGU39DUet_WsK9CniI6_aWuemxML6cEt_L1eg/viewform';
export const QUESTIONS = [
 ['name','Nome Completo'], ['stake','Qual sua Estaca?'], ['ward','Qual sua Ala?'],
 ['age','Qual sua Idade?'], ['profession','Qual a sua profissão?'],
 ['education','Estuda ou estudou alguma coisa?'], ['membership','É membro ou não membro?'],
 ['hobbies','O que você gosta de fazer? Tem algum hobbie?'], ['mission','Fez missão? Se sim, aonde?'],
 ['strengths','Fale 3 pontos fortes seus:'], ['curiosity','1 curiosidade sobre você:'],
];
export const HOBBIES=['Dançar','Cantar','Tocar instrumento','Cozinhar','Praticar esportes','Trilhas e natureza','Cinema e séries','Ler','Jogos de tabuleiro','Fotografia','Viajar','Voluntariado','Artes','Conversar com amigos'];
export const STRENGTHS=['Carinhoso(a)','Bem-humorado(a)','Comunicativo(a)','Paciente','Responsável','Leal','Criativo(a)','Prestativo(a)','Determinado(a)','Bom ouvinte','Otimista','Organizado(a)'];
export class InputError extends Error {}
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
export function hobbyTags(s) { return [...new Set(s.split(/[,;\n]+/).map(normalize).filter(Boolean))]; }
export function validate(input) {
 if(input?.questionnaireVersion==='choices-v2')return validateChoices(input);
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
 if (!['homem','mulher'].includes(input.gender)) throw new InputError('Informe homem ou mulher.');
 p.gender=input.gender;
 p.seeking=p.gender==='homem'?'mulher':'homem';
 for (const key of ['member','servedMission']) {
  if (typeof input[key] !== 'boolean') throw new InputError('Responda os campos complementares.');
  p[key]=input[key];
 }
 if (input.consent !== true) throw new InputError('É necessário autorizar o uso dos dados para participar.');
 if (typeof input.email !== 'string' || input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new InputError('Informe um e-mail válido.');
 p.email = input.email.trim().toLowerCase();
 p.consent=true; p.consentVersion='2026-11-14-v2'; p.questionnaireVersion='brooklin-v1';
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
 if (a.id===b.id || !['brooklin-v1','choices-v2'].includes(a.questionnaireVersion) || !['brooklin-v1','choices-v2'].includes(b.questionnaireVersion)) return null;
 if (!['homem','mulher'].includes(a.gender) || !['homem','mulher'].includes(b.gender) || a.gender===b.gender) return null;
 if ((a.seeking!=='qualquer' && a.seeking!==b.gender) || (b.seeking!=='qualquer' && b.seeking!==a.gender)) return null;
 if (a.age<b.minAge || a.age>b.maxAge || b.age<a.minAge || b.age>a.maxAge) return null;
 if(a.desired || b.desired){const raw=Math.min(preferenceScore(a,b),preferenceScore(b,a));return raw>70?{score:Math.round(raw*100)/100,common:[]}:null;}
 const x=hobbyTags(a.hobbies), y=hobbyTags(b.hobbies), common=x.filter(t=>y.includes(t));
 const raw=70*(2*common.length/(x.length+y.length || 1)) + (a.servedMission===b.servedMission?30:0);
 if (raw<=70) return null;
 return {score:Math.round(raw*100)/100,common};
}
function cleanText(value,label,required=false){if(value===undefined||value===null)value='';if(typeof value!=='string'||value.length>1000|| (required&&!value.trim()))throw new InputError(`Confira: ${label}.`);return value.trim();}
function choices(value,label,min=0,max=30){if(!Array.isArray(value)||value.length<min||value.length>max)throw new InputError(`${label}: escolha ${min===max?min:`de ${min} a ${max}`} opções.`);const out=value.map(x=>cleanText(x,label,true));if(out.some(x=>x.length>80)||new Set(out.map(normalize)).size!==out.length)throw new InputError(`${label}: evite opções repetidas e use até 80 caracteres por opção.`);return out;}
function validateChoices(input){
 const p={questionnaireVersion:'choices-v2',consentVersion:'2026-11-14-v2',consent:true};
 if(input.consent!==true)throw new InputError('É necessário autorizar o uso dos dados para participar.');
 for(const k of ['name','curiosity'])p[k]=cleanText(input[k],k,true);
 for(const k of ['member','servedMission']){if(typeof input[k]!=='boolean')throw new InputError('Responda se é membro e se serviu missão.');p[k]=input[k];}
 if(!['homem','mulher'].includes(input.gender))throw new InputError('Informe homem ou mulher.');p.gender=input.gender;p.seeking=p.gender==='homem'?'mulher':'homem';
 for(const k of ['age','minAge','maxAge']){if(!Number.isInteger(input[k])||input[k]<18||input[k]>99)throw new InputError('Idades: use números inteiros entre 18 e 99.');p[k]=input[k];}if(p.minAge>p.maxAge)throw new InputError('Confira a faixa etária desejada.');
 p.ward=p.member?cleanText(input.ward,'Ala',true):'';p.stake=p.member?cleanText(input.stake,'Estaca',true):'';p.membership=p.member?'Membro':'Não membro';
 for(const k of ['profession','education'])p[k]=cleanText(input[k],k);
 p.missionLocation=p.servedMission?cleanText(input.missionLocation,'Onde serviu missão',true):'';p.mission=p.servedMission?`Sim — ${p.missionLocation}`:'Não';
 p.hobbyChoices=choices(input.hobbyChoices,'Hobbies',1);p.strengthChoices=choices(input.strengthChoices,'Pontos fortes',3,3);p.hobbies=p.hobbyChoices.join(', ');p.strengths=p.strengthChoices.join(', ');
 const d=input.desired;if(!d||typeof d!=='object'||Array.isArray(d))throw new InputError('Preencha o que você procura.');p.desired={};
 if(!['any','true','false'].includes(d.servedMission))throw new InputError('Confira o que você procura.');p.desired.servedMission=d.servedMission;
 p.desired.hobbies=choices(d.hobbies,'Hobbies desejados');p.desired.strengths=choices(d.strengths,'Qualidades desejadas',0,3);
 for(const k of ['profession','education'])p.desired[k]=cleanText(d[k],k);
 if(!p.desired.hobbies.length&&!p.desired.strengths.length&&p.desired.servedMission==='any'&&!['profession','education'].some(k=>p.desired[k]))throw new InputError('Escolha ao menos uma característica que procura.');
 if(typeof input.email!=='string'||input.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))throw new InputError('Informe um e-mail válido.');p.email=input.email.toLowerCase();
 if(input.photo){if(typeof input.photo!=='string'||input.photo.length>300000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(input.photo))throw new InputError('Foto JPG inválida.');let bytes;try{bytes=atob(input.photo.split(',')[1]);}catch{throw new InputError('Foto inválida.');}if(!bytes.startsWith('\xff\xd8\xff'))throw new InputError('Foto inválida.');p.photo=input.photo;}
 return p;
}
export function preferenceScore(person,other){
 if(!person.desired){const x=hobbyTags(person.hobbies),y=hobbyTags(other.hobbies);return 70*2*x.filter(t=>y.includes(t)).length/(x.length+y.length||1)+(person.servedMission===other.servedMission?30:0);}
 const d=person.desired;let score=0,total=0;
 for(const [key,own,weight] of [['hobbies','hobbyChoices',40],['strengths','strengthChoices',30]]){const wanted=d[key].map(normalize);if(wanted.length){total+=weight;const has=(other[own]||String(other[key]||'').split(/[,;\n]+/)).map(normalize);score+=weight*wanted.filter(x=>has.includes(x)).length/wanted.length;}}
 if(d.servedMission!=='any'){total+=15;if(String(other.servedMission)===d.servedMission)score+=15;}
 for(const key of ['profession','education'])if(d[key]){total+=5;if(normalize(d[key])===normalize(other[key]||''))score+=5;}
 // Older profiles may have selected only the removed membership criteria.
 // Fall back to their interests instead of making those profiles unmatchable.
 return total?100*score/total:preferenceScore({...person,desired:undefined},other);
}
export function visibleMatch(me,candidate,accepted,partnerAccepted) {
 const result=compatibility(me,candidate); if (!result) return null;
 const mutual=accepted && partnerAccepted;
 const partner={};
 if (mutual) {
  for (const [key] of QUESTIONS) partner[key]=candidate[key];
  partner.email=candidate.email;
  if (candidate.photo) partner.photo=candidate.photo;
 }
 return {id:candidate.id,score:result.score,accepted,mutual,partner};
}
export async function digest(s) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join(''); }
export function newToken() { return [...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join(''); }
