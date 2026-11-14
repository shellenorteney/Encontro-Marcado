// The Gmail transport is loaded only when configured. No credentials enter the client.
export function mailProvider(env){
 if(env('GMAIL_USER')?.toLowerCase().endsWith('@gmail.com') && env('GMAIL_APP_PASSWORD'))return 'gmail';
 if(env('RESEND_API_KEY') && env('MAIL_FROM'))return 'resend';
 return null;
}
export function createMailer(env,{request=fetch,loadSmtp=()=>import('npm:nodemailer@10.5.0')}={}){
 return async function deliver(item,message){
  const provider=mailProvider(env);if(!provider)throw new Error('Email is not configured');
  if(provider==='resend'){
   const result=await request('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env('RESEND_API_KEY')}`,'Content-Type':'application/json','Idempotency-Key':`${item.kind}-${item.recipient}-${item.partner}`},body:JSON.stringify({from:env('MAIL_FROM'),to:[item.email],...message}),signal:AbortSignal.timeout(10000)});
   if(!result.ok)throw new Error('Email provider rejected message');
   return;
  }
  const user=env('GMAIL_USER').trim().toLowerCase();
  const module=await loadSmtp();const nodemailer=module.default||module;
  // Supabase blocks 25/587; Gmail supports implicit TLS on 465.
  const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user,pass:env('GMAIL_APP_PASSWORD').replace(/\s/g,'')},tls:{rejectUnauthorized:true,minVersion:'TLSv1.2'},connectionTimeout:15000,greetingTimeout:15000,socketTimeout:30000,logger:false,debug:false,disableFileAccess:true,disableUrlAccess:true});
  try{
   const {attachments,...content}=message;
   const result=await transport.sendMail({...content,from:{name:'Encontro Marcado',address:user},to:[item.email],messageId:`<${item.kind}-${item.recipient}-${item.partner}@gmail.com>`,...(attachments?{attachments:attachments.map(a=>({filename:a.filename,content:a.content,encoding:'base64',contentType:a.content_type}))}:{})});
   if(!result.accepted?.some(address=>String(address).toLowerCase()===item.email.toLowerCase()))throw new Error('Recipient not accepted');
  }finally{transport.close();}
 };
}
