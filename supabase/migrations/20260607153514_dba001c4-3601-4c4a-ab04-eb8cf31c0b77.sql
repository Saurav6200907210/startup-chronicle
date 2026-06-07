
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INT NOT NULL DEFAULT 0
);

CREATE INDEX reports_created_at_idx ON public.reports (created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.reports TO anon, authenticated;
GRANT ALL ON public.reports TO service_role;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reports are publicly readable"
  ON public.reports FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can increment view count"
  ON public.reports FOR UPDATE
  USING (true) WITH CHECK (true);
