-- Telefavor Database Schema
-- Run this in Supabase SQL Editor to create all required tables

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                TEXT PRIMARY KEY,
  google_id         TEXT,
  email             TEXT DEFAULT '',
  display_name      TEXT DEFAULT '',
  photo_url         TEXT DEFAULT '',
  telegram_username TEXT DEFAULT '',
  trust_score       INTEGER DEFAULT 0,
  green_ratings     INTEGER DEFAULT 0,
  red_ratings       INTEGER DEFAULT 0,
  total_listings_posted INTEGER DEFAULT 0,
  contact_taps_received INTEGER DEFAULT 0,
  has_onboarded     BOOLEAN DEFAULT FALSE,
  last_active       TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_username);

-- ============================================================
-- 2. LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT REFERENCES users(id) ON DELETE CASCADE,
  telegram_username TEXT NOT NULL,
  title             TEXT NOT NULL,
  message           TEXT,
  posted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ NOT NULL,
  contact_taps      INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_user  ON listings(user_id);

-- ============================================================
-- 3. RATINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS ratings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id        TEXT REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id   TEXT REFERENCES users(id) ON DELETE CASCADE,
  listing_id      TEXT NOT NULL,
  result          TEXT NOT NULL CHECK (result IN ('green', 'red')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate ratings on the same listing by the same rater
CREATE UNIQUE INDEX IF NOT EXISTS idx_ratings_unique ON ratings(rater_id, listing_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated ON ratings(rated_user_id);

-- ============================================================
-- ADD COLUMNS FOR EXISTING TABLES
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_verified BOOLEAN DEFAULT FALSE;

-- ============================================================
-- 4. VERIFICATION CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_codes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT NOT NULL,
  code              TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  telegram_id       BIGINT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  expires_at        TIMESTAMPTZ NOT NULL,
  verified          BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_verification_codes ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_user ON verification_codes(user_id);

-- ============================================================
-- HELPER: Drop everything for a clean reset (use cautiously)
-- ============================================================
-- DROP TABLE IF EXISTS verification_codes;
-- DROP TABLE IF EXISTS ratings;
-- DROP TABLE IF EXISTS listings;
-- DROP TABLE IF EXISTS users;
