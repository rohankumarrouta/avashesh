CREATE OR REPLACE FUNCTION public.inquiry_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ DECLARE digits text; BEGIN
 digits=regexp_replace(NEW.contact,'[ ()+-]','','g');
 IF NOT (digits ~ '^([6-9][0-9]{9}|91[6-9][0-9]{9})$' OR NEW.contact ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') THEN RAISE EXCEPTION 'Invalid buyer contact'; END IF;
 IF TG_OP='UPDATE' AND (NEW.id<>OLD.id OR NEW.listing_id<>OLD.listing_id OR NEW.buyer_id<>OLD.buyer_id OR NEW.buyer_name<>OLD.buyer_name OR NEW.contact<>OLD.contact OR NEW.message<>OLD.message OR NEW.created_at<>OLD.created_at) THEN RAISE EXCEPTION 'Only inquiry status can change'; END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.inquiry_guard() FROM PUBLIC,anon,authenticated;