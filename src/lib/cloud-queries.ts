import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const publishedListingsOptions = queryOptions({ queryKey: ["published-listings"], queryFn: async () => {
  const rows = []; for(let offset=0; ; offset+=500) { const {data,error}=await supabase.from("listings").select("*").eq("status","published").order("created_at",{ascending:false}).range(offset,offset+499); if(error) throw new Error("Could not load available listings."); rows.push(...data); if(data.length<500) break; } return rows;
} });
export const listingOptions = (id: string) => queryOptions({ queryKey:["listing",id],queryFn:async()=>{const {data,error}=await supabase.from("listings").select("*").eq("id",id).neq("status","deleted").maybeSingle();if(error)throw new Error("Could not load listing.");return data;} });