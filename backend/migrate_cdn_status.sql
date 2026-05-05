-- Migration: Add cdn_status column to media table
-- Run this against your MySQL database to support CDN processing state tracking.

ALTER TABLE media ADD COLUMN cdn_status VARCHAR(20) DEFAULT 'ready' AFTER folder_id;

-- This column tracks the Kroombox CDN processing state:
-- 'ready'      = File is fully processed and available for viewing
-- 'processing' = File is still being processed (virus scan, format conversion, etc.)
