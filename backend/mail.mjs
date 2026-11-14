import {QUESTIONS} from './domain.mjs';
export async function mailAccessToken(secret,id) {
 const encoder=new TextEncoder();
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode('connection-mail-access-v1:'+id)))].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function mailMessage(item,link) {
 if (item.kind==='match') return {subject:'Deu match! Você quer aceitar? 💌',text:`Encontramos uma conexão com compatibilidade acima de 70%.\n\nAbra o link e clique em "Aceitar match":\n${link}\n\nSe os dois aceitarem, cada um receberá outro e-mail com o perfil, a foto opcional e o contato da outra pessoa. Nenhum dado do perfil será revelado antes disso.\n\nEste link é pessoal. Não o encaminhe.`};
 if(item.kind!=='profile' || !item.mutual || !item.profile) throw new Error('Mutual consent required for profile email');
 const p=item.profile;
 const text=`Vocês dois aceitaram o match! 💌\n\nConheça a outra pessoa:\n\n${QUESTIONS.map(([key,label])=>`${label}: ${p[key]??''}`).join('\n\n')}\n\nE-mail para conversar: ${p.email}\n\n${p.photo?'A foto está anexada.\n\n':''}Acesse seu espaço: ${link}\n\nEste perfil foi compartilhado com autorização dos dois. Respeite a privacidade da outra pessoa.`;
 return {subject:'Match aceito pelos dois! Conheça seu par 💌',text,...(p.photo?{attachments:[{filename:'foto-do-perfil.jpg',content:p.photo.split(',')[1],content_type:'image/jpeg'}]}:{})};
}
