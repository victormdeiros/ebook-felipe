-- Migration 013: update current event reminder schedule to 10/06/2026 16:00 BRT

SET search_path TO ebookfelipelopes;

UPDATE manual_email_queue
SET scheduled_at = CASE template_id
  WHEN 'event_1d' THEN TIMESTAMPTZ '2026-06-09 16:00:00-03'
  WHEN 'event_3h' THEN TIMESTAMPTZ '2026-06-10 13:00:00-03'
  WHEN 'event_1h' THEN TIMESTAMPTZ '2026-06-10 15:00:00-03'
  ELSE scheduled_at
END
WHERE status = 'pending'
  AND template_id IN ('event_1d', 'event_3h', 'event_1h');
