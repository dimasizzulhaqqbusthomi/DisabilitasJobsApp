-- ============================================================
-- SQL SCRIPT UNTUK SETUP SUPABASE STORAGE BUCKET "avatars"
-- ============================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih project Anda: "difabel-jobs-app"
-- 3. Masuk ke menu "SQL Editor" di sidebar kiri
-- 4. Klik "New query"
-- 5. Copy seluruh kode SQL di bawah ini dan klik tombol "Run"
-- ============================================================

-- 1. Buat storage bucket "avatars" (public agar URL bisa diakses langsung)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. RLS Policy: User hanya bisa upload ke folder miliknya sendiri
-- Format path: avatars/{user_id}/avatar.{ext}

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "User dapat upload avatar sendiri" ON storage.objects;
DROP POLICY IF EXISTS "User dapat update avatar sendiri" ON storage.objects;
DROP POLICY IF EXISTS "User dapat hapus avatar sendiri" ON storage.objects;
DROP POLICY IF EXISTS "Avatar dapat dilihat semua orang" ON storage.objects;

-- Policy: Siapapun (termasuk tidak login) dapat melihat avatar (bucket public)
CREATE POLICY "Avatar dapat dilihat semua orang"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy: User yang login hanya bisa upload ke folder {user_id}/
CREATE POLICY "User dapat upload avatar sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: User yang login hanya bisa update file miliknya
CREATE POLICY "User dapat update avatar sendiri"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: User yang login hanya bisa hapus file miliknya
CREATE POLICY "User dapat hapus avatar sendiri"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
