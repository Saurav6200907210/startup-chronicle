
DROP POLICY "Anyone can create reports" ON public.reports;
DROP POLICY "Anyone can increment view count" ON public.reports;
REVOKE INSERT, UPDATE ON public.reports FROM anon, authenticated;
