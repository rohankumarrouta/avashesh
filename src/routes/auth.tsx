import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { marketField } from "@/components/MarketplaceShared";
import { credentialsSchema, signupSchema, safeNext } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
export const Route=createFileRoute('/auth')({validateSearch:zodValidator(z.object({next:fallback(z.string(),'').default(''),role:fallback(z.string(),'buyer').default('buyer')})),head:()=>({meta:[{title:'Sign in or join — Avashesh'},{name:'description',content:'Join Avashesh as a Farmer or Buyer.'},{property:'og:title',content:'Sign in or join — Avashesh'},{property:'og:description',content:'Farmer and Buyer accounts for agricultural waste listings.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Auth});
function Auth(){
 const {next,role:chosen}=Route.useSearch(); const {user,role}=useAccount(); const navigate=useNavigate();
 const [mode,setMode]=useState<'login'|'signup'|'reset'>('login'),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 useEffect(()=>{if(user&&role){const target=safeNext(next||window.sessionStorage.getItem('avashesh.auth-next')||'');window.sessionStorage.removeItem('avashesh.auth-next'); if(target==='/marketplace/sell'&&role==='farmer') void navigate({to:'/marketplace/sell'}); else if(target.startsWith('/marketplace/') && target!='/marketplace/sell') void navigate({to:'/marketplace/$listingId',params:{listingId:target.split('/')[2]??''}}); else void navigate({to:role==='farmer'?'/farmer':'/buyer'});}},[user,role,next,navigate]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');setMessage('');const input=Object.fromEntries(new FormData(e.currentTarget));
  const parsed=mode==='signup'?signupSchema.safeParse(input):mode==='reset'?z.object({email:z.string().trim().email().max(255)}).safeParse(input):credentialsSchema.safeParse(input);
  if(!parsed.success){setError(parsed.error.issues.map(i=>i.message).join(' '));return;}if(safeNext(next))window.sessionStorage.setItem('avashesh.auth-next',safeNext(next));setBusy(true);
  try{if(mode==='signup'){const v=signupSchema.parse(input);const {data,error}=await supabase.auth.signUp({email:v.email,password:v.password,options:{emailRedirectTo:window.location.origin,data:{display_name:v.display_name,contact:v.contact,role:v.role}}});if(error)throw error;if(!data.session)setMessage('Check your email to confirm your account, then sign in here.');}
  else if(mode==='reset'){const {error}=await supabase.auth.resetPasswordForEmail(String(input['email']),{redirectTo:window.location.origin+'/reset-password'});if(error)throw error;setMessage('If an account exists, a password reset email will be sent.');}
  else {const v=credentialsSchema.parse(input);const {error}=await supabase.auth.signInWithPassword(v);if(error)throw error;}}
  catch(e){setError(e instanceof Error?e.message:'Could not complete request.');}finally{setBusy(false);}
 }
 return <Page><h1 className="text-2xl font-bold">{mode==='signup'?'Join Avashesh':mode==='reset'?'Reset your password':'Sign in'}</h1>
 <div className="flex flex-wrap gap-2"><Button variant={mode==='login'?'default':'outline'} onClick={()=>{setMode('login');setMessage('');setError('');}}>Log in</Button><Button variant={mode==='signup'?'default':'outline'} onClick={()=>{setMode('signup');setMessage('');setError('');}}>Sign up</Button></div>
 <form onSubmit={submit} className="space-y-4" noValidate>
 {mode==='signup'&&<><label className="block">Display name<input name="display_name" maxLength={100} className={marketField}/></label><label className="block">Contact number (optional)<input name="contact" type="tel" maxLength={30} className={marketField}/></label><label className="block">Account type<select name="role" defaultValue={chosen==='farmer'?'farmer':'buyer'} className={marketField}><option value="farmer">Farmer / Seller</option><option value="buyer">Buyer</option></select></label></>}
 <label className="block">Email<input type="email" name="email" autoComplete="email" maxLength={255} className={marketField}/></label>
 {mode!=='reset'&&<label className="block">Password<input type="password" name="password" autoComplete={mode==='signup'?'new-password':'current-password'} minLength={8} maxLength={128} className={marketField}/></label>}
 {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}{message&&<p role="status" className="text-sm text-primary">{message}</p>}
 <Button disabled={busy} type="submit" className="w-full">{busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Send reset email':'Sign in'}</Button>
 </form><Button variant="link" onClick={()=>setMode('reset')}>Forgot password?</Button>
 <p className="text-xs text-muted-foreground">Your account name and contact are private. Publishing a listing makes its seller name and supplied phone number public. Email confirmation is required.</p></Page>;
}
