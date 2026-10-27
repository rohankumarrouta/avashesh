import { createFileRoute } from '@tanstack/react-router';
import { AccountDashboard } from '@/components/AccountDashboard';
export const Route=createFileRoute('/_authenticated/buyer')({head:()=>({meta:[{title:'Buyer dashboard — Avashesh'},{name:'description',content:'Track your agricultural waste inquiries.'},{property:'og:title',content:'Buyer dashboard — Avashesh'},{property:'og:description',content:'Private buyer inquiry history.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:()=> <AccountDashboard expected="buyer"/>});
