CREATE OR REPLACE FUNCTION public.get_site_stats()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'total', (SELECT count(*)::int FROM public.page_views),
    'last7', (SELECT count(*)::int FROM public.page_views WHERE created_at >= now() - interval '7 days'),
    'daily', (
      SELECT coalesce(json_agg(json_build_object('date', to_char(days.d, 'YYYY-MM-DD'), 'count', counts.c) ORDER BY days.d), '[]'::json)
      FROM generate_series(date_trunc('day', now())::date - 6, date_trunc('day', now())::date, interval '1 day') AS days(d)
      LEFT JOIN (
        SELECT date_trunc('day', created_at)::date AS dd, count(*)::int AS c
        FROM public.page_views
        WHERE created_at >= date_trunc('day', now()) - interval '6 days'
        GROUP BY 1
      ) counts ON counts.dd = days.d
    ),
    'by_path', (
      SELECT coalesce(json_agg(json_build_object('label', t.path, 'count', t.c) ORDER BY t.c DESC), '[]'::json)
      FROM (SELECT path, count(*)::int AS c FROM public.page_views GROUP BY path ORDER BY c DESC LIMIT 12) t
    ),
    'by_referrer', (
      SELECT coalesce(json_agg(json_build_object('label', t.label, 'count', t.c) ORDER BY t.c DESC), '[]'::json)
      FROM (SELECT coalesce(nullif(referrer, ''), 'Direct') AS label, count(*)::int AS c FROM public.page_views GROUP BY 1 ORDER BY c DESC LIMIT 10) t
    ),
    'by_country', (
      SELECT coalesce(json_agg(json_build_object('label', t.label, 'count', t.c) ORDER BY t.c DESC), '[]'::json)
      FROM (SELECT coalesce(nullif(country, ''), 'Unknown') AS label, count(*)::int AS c FROM public.page_views GROUP BY 1 ORDER BY c DESC LIMIT 10) t
    )
  );
$$;

REVOKE ALL ON FUNCTION public.get_site_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_stats() TO service_role;