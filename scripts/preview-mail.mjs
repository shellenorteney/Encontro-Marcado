import {mkdir,writeFile} from 'node:fs/promises';import {mailMessage} from '../backend/mail.mjs';
const out=process.argv[2]||'mail-preview';await mkdir(out,{recursive:true});
const link='https://example.invalid/conexao-demonstracao';
for(const kind of ['match','profile']){
 const message=mailMessage({kind,recipientName:'Ana Silva',mutual:true,profile:{name:'Lucas',age:27,membership:'Membro',ward:'Ala de exemplo',stake:'Estaca de exemplo',profession:'Designer',education:'Comunicação',hobbies:'Dançar, Viajar, Cozinhar',mission:'Sim — Brasil',strengths:'Bem-humorado, Responsável, Bom ouvinte',curiosity:'Sempre tento aprender uma receita nova.',email:'lucas@example.invalid'}},link);
 await writeFile(`${out}/email-${kind}.html`,message.html);
}
console.log('Two demonstration emails rendered; no messages sent.');
