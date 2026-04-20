-- Migration 009 — Courtesy inscriptions support
-- Adds courtesy_by to manual_orders to track who granted the courtesy inscription

ALTER TABLE ebookfelipelopes.manual_orders
  ADD COLUMN IF NOT EXISTS courtesy_by TEXT;
