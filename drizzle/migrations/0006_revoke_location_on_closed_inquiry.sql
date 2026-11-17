DROP POLICY IF EXISTS location_contacted_buyer_read ON public.listing_locations;
CREATE POLICY location_contacted_buyer_read ON public.listing_locations FOR SELECT TO authenticated
USING (public.has_market_role('buyer'::market_role) AND EXISTS (
  SELECT 1 FROM public.inquiries i
  WHERE i.listing_id = listing_locations.listing_id
    AND i.buyer_id = (SELECT auth.uid())
    AND i.status <> 'closed'));