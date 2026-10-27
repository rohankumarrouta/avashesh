import { createFileRoute } from '@tanstack/react-router';
import { useEffect,useState,type FormEvent } from 'react';
import { z } from 'zod';
import { Page } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { marketField } from '@/components/MarketplaceShared';
import { supabase } from '@/integrations/supabase/client';
export const Route=createFileRoute('/reset-password')({head:()=>({meta:[{title:'Set a new password — Avashesh'},{name:'description',content:'Securely reset your Avashesh account password.'},{property:'og:title',content:'Set a new password — Avashesh'},{property:'og:description',content:'Password recovery for Avashesh accounts.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Reset});
function Reset(){const [recovery,setRecovery]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{setRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type')==='recovery');const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setRecovery(true);});return()=>data.subscription.unsubscribe();},[]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=new FormData(e.currentTarget);const p=z.string().min(8).max(128).safeParse(form.get('password'));if(!p.success||p.data!==form.get('confirm')){setMessage('Use at least 8 characters and matching passwords.');return;}setBusy(true);const {error}=await supabase.auth.updateUser({password:p.data});setMessage(error?error.message:'Password updated. You can sign in with your new password.');setBusy(false);}
 return <Page><h1 className="text-2xl font-bold">Set a new password</h1>{recovery?<form onSubmit={submit} className="space-y-4"><label className="block">New password<input name="password" type="password" maxLength={128} className={marketField}/></label><label className="block">Confirm password<input name="confirm" type="password" maxLength={128} className={marketField}/></label><Button disabled={busy} type="submit">Update password</Button></form>:<p>Open the password reset link from your email to continue.</p>}{message&&<p role="status">{message}</p>}</Page>;}
