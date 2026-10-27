import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
const AccountContext = createContext<{ user: User | null; ready: boolean }>({ user: null, ready: false });
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null), [ready, setReady] = useState(false);
  const router = useRouter(); const client = useQueryClient();
  useEffect(() => {
    let live = true;
    void supabase.auth.getUser().then(({ data }) => { if(live) { setUser(data.user); setReady(true); } });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!live) return;
      setUser(session?.user ?? null); setReady(true);
      if (["SIGNED_IN","SIGNED_OUT","USER_UPDATED"].includes(event)) { void router.invalidate(); if(event !== "SIGNED_OUT") void client.invalidateQueries(); }
    });
    return () => { live=false; data.subscription.unsubscribe(); };
  }, [router, client]);
  return <AccountContext.Provider value={{ user, ready }}>{children}</AccountContext.Provider>;
}
export function useAccount() {
  const { user, ready } = useContext(AccountContext);
  const profile = useQuery({ queryKey: ["account",user?.id], enabled: ready && !!user, queryFn: async () => {
    if(!user) throw new Error("Sign in first.");
    const [p,r] = await Promise.all([supabase.from("profiles").select("*").eq("id",user.id).single(), supabase.from("user_roles").select("role").eq("user_id",user.id).single()]);
    if(p.error || r.error) throw new Error("Could not load account information.");
    return { profile: p.data, role: r.data.role };
  } });
  const client=useQueryClient(), navigate=useNavigate();
  async function logout() { await client.cancelQueries(); client.clear(); const {error}=await supabase.auth.signOut(); if(error) throw error; await navigate({to:"/auth",search:{next:"",role:"buyer"},replace:true}); }
  return { user, ready, profile: profile.data?.profile, role: profile.data?.role, accountError: profile.error, logout };
}