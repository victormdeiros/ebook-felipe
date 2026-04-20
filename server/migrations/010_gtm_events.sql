-- Migration 010 — GTM events catalog
-- Seeds the config key so the admin panel can persist custom GTM event definitions

INSERT INTO ebookfelipelopes.manual_config (key, value)
VALUES ('gtm_events_catalog', '[]')
ON CONFLICT (key) DO NOTHING;
