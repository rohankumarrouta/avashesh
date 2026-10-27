ALTER POLICY waste_photo_read ON storage.objects TO authenticated USING (bucket_id = 'waste-photos' AND (storage.foldername(name))[1] = (SELECT auth.uid()::text));
ALTER TABLE public.listings ADD COLUMN district text NOT NULL DEFAULT '' CHECK (char_length(trim(district)) <= 100), ADD COLUMN state text NOT NULL DEFAULT '' CHECK (char_length(trim(state)) <= 100);
CREATE TABLE public.listing_locations (listing_id uuid PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE, full_location text NOT NULL CHECK (char_length(trim(full_location)) BETWEEN 1 AND 120));
GRANT SELECT ON public.listing_locations TO authenticated;
GRANT ALL ON public.listing_locations TO service_role;
ALTER TABLE public.listing_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY location_owner_read ON public.listing_locations FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = (SELECT auth.uid())));
CREATE POLICY location_contacted_buyer_read ON public.listing_locations FOR SELECT TO authenticated USING (public.has_market_role('buyer') AND EXISTS (SELECT 1 FROM public.inquiries i WHERE i.listing_id = listing_locations.listing_id AND i.buyer_id = (SELECT auth.uid())));
INSERT INTO public.listing_locations(listing_id, full_location) SELECT id, location FROM public.listings;
UPDATE public.listings SET location = 'District/state not yet provided';
COMMENT ON COLUMN public.listings.location IS 'DEPRECATED: sanitized compatibility label; use district/state publicly and listing_locations.full_location privately.';
CREATE FUNCTION public.guard_public_listing_location() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.location := COALESCE(NULLIF(concat_ws(', ', NULLIF(trim(NEW.district), ''), NULLIF(trim(NEW.state), '')), ''), 'District/state not yet provided'); RETURN NEW; END $$;
CREATE TRIGGER guard_public_listing_location BEFORE INSERT OR UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.guard_public_listing_location();
CREATE FUNCTION public.save_listing_with_location(listing_data jsonb, full_location text, listing_id uuid DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE caller uuid := auth.uid(); saved_id uuid; BEGIN
IF caller IS NULL OR NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = caller AND r.role = 'farmer') THEN RAISE EXCEPTION 'Only Farmers can save listings'; END IF;
IF char_length(trim(full_location)) NOT BETWEEN 1 AND 120 OR char_length(trim(COALESCE(listing_data->>'district',''))) NOT BETWEEN 1 AND 100 OR char_length(trim(COALESCE(listing_data->>'state',''))) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Location fields required'; END IF;
IF listing_id IS NULL THEN
INSERT INTO public.listings(seller_id,waste_type,quantity,unit,price,location,district,state,description,photo,seller_name,seller_contact,status) VALUES(caller,listing_data->>'waste_type',(listing_data->>'quantity')::numeric,listing_data->>'unit',(listing_data->>'price')::numeric,'Public area',trim(listing_data->>'district'),trim(listing_data->>'state'),listing_data->>'description',COALESCE(listing_data->>'photo',''),listing_data->>'seller_name',listing_data->>'seller_contact',listing_data->>'status') RETURNING id INTO saved_id;
ELSE
UPDATE public.listings SET waste_type=listing_data->>'waste_type',quantity=(listing_data->>'quantity')::numeric,unit=listing_data->>'unit',price=(listing_data->>'price')::numeric,district=trim(listing_data->>'district'),state=trim(listing_data->>'state'),description=listing_data->>'description',photo=COALESCE(listing_data->>'photo',''),seller_name=listing_data->>'seller_name',seller_contact=listing_data->>'seller_contact',status=listing_data->>'status' WHERE id=listing_id AND seller_id=caller RETURNING id INTO saved_id;
IF saved_id IS NULL THEN RAISE EXCEPTION 'Listing not yours'; END IF;
END IF;
INSERT INTO public.listing_locations(listing_id,full_location) VALUES(saved_id,trim(full_location)) ON CONFLICT (listing_id) DO UPDATE SET full_location=EXCLUDED.full_location;
RETURN saved_id; END $$;
REVOKE ALL ON FUNCTION public.save_listing_with_location(jsonb,text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_listing_with_location(jsonb,text,uuid) TO authenticated;