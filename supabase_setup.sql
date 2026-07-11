-- ============================================================
-- SQL SCRIPT UNTUK SETUP TABLE DAN SEED DATA PERSONA ABLEWORK
-- ============================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih project Anda: "difabel-jobs-app"
-- 3. Masuk ke menu "SQL Editor" di sidebar kiri
-- 4. Klik "New query"
-- 5. Copy seluruh kode SQL di bawah ini dan klik tombol "Run"
-- ============================================================

-- 1. Aktifkan extension pgcrypto untuk enkripsi kata sandi
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Buat tabel public.profiles jika belum ada
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  disability_type TEXT,
  accessibility_needs TEXT[] DEFAULT '{}',
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience TEXT,
  education TEXT,
  avatar TEXT,
  working_style TEXT[] DEFAULT '{}',
  target_careers TEXT[] DEFAULT '{}',
  location TEXT,
  portfolios JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tambahkan kolom jika tabel sudah ada sebelumnya
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS working_style TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_careers TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolios JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;

-- 3. Aktifkan Row Level Security (RLS) pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Policies)
DROP POLICY IF EXISTS "Profil dapat dibaca oleh pemilik" ON public.profiles;
CREATE POLICY "Profil dapat dibaca oleh pemilik" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profil dapat diupdate oleh pemilik" ON public.profiles;
CREATE POLICY "Profil dapat diupdate oleh pemilik" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profil dapat ditambahkan oleh pemilik" ON public.profiles;
CREATE POLICY "Profil dapat ditambahkan oleh pemilik" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);


-- 4. Tambahkan User Baru ke dalam auth.users (Tabel Auth Supabase)
-- Password untuk semua akun di bawah ini adalah: password123

-- Hapus user lama jika ada agar bersih dan bisa di-insert ulang secara utuh
DELETE FROM auth.users WHERE email IN ('sinta@ablework.com', 'budi@ablework.com', 'adi@ablework.com', 'dina@ablework.com');

-- A. Persona 1: Sinta (sinta@ablework.com)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
SELECT
  'de32252a-995a-4bbf-85f0-5c6218d6e3c1',
  '00000000-0000-0000-0000-000000000000',
  'sinta@ablework.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Sinta","disability_type":"neurodivergent"}',
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  false,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'sinta@ablework.com'
);

-- B. Persona 2: Budi (budi@ablework.com)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
SELECT
  'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2',
  '00000000-0000-0000-0000-000000000000',
  'budi@ablework.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Budi","disability_type":"daksa"}',
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  false,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'budi@ablework.com'
);

-- C. Persona 3: Adi (adi@ablework.com)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
SELECT
  'ad12252a-995a-4bbf-85f0-5c6218d6e3c3',
  '00000000-0000-0000-0000-000000000000',
  'adi@ablework.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Adi","disability_type":"rungu"}',
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  false,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'adi@ablework.com'
);

-- D. Persona 4: Dina (dina@ablework.com) - 100% Completeness & 100% Match for Admin Online
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
SELECT
  'd1ea9999-9999-9999-9999-999999999999',
  '00000000-0000-0000-0000-000000000000',
  'dina@ablework.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Dina","disability_type":"none"}',
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  false,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'dina@ablework.com'
);


-- 5. Hubungkan data login ke auth.identities agar bisa login (PENTING!)
-- Tanpa ini, Supabase akan mengembalikan error 500 "Database error querying schema"

-- A. Identity Sinta
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  'de32252a-995a-4bbf-85f0-5c6218d6e3c1',
  'de32252a-995a-4bbf-85f0-5c6218d6e3c1',
  jsonb_build_object('sub', 'de32252a-995a-4bbf-85f0-5c6218d6e3c1', 'email', 'sinta@ablework.com', 'email_verified', true),
  'email',
  'de32252a-995a-4bbf-85f0-5c6218d6e3c1',
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'de32252a-995a-4bbf-85f0-5c6218d6e3c1'
);

-- B. Identity Budi
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2',
  'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2',
  jsonb_build_object('sub', 'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', 'email', 'budi@ablework.com', 'email_verified', true),
  'email',
  'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2',
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2'
);

-- C. Identity Adi
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  'ad12252a-995a-4bbf-85f0-5c6218d6e3c3',
  'ad12252a-995a-4bbf-85f0-5c6218d6e3c3',
  jsonb_build_object('sub', 'ad12252a-995a-4bbf-85f0-5c6218d6e3c3', 'email', 'adi@ablework.com', 'email_verified', true),
  'email',
  'ad12252a-995a-4bbf-85f0-5c6218d6e3c3',
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'ad12252a-995a-4bbf-85f0-5c6218d6e3c3'
);

-- D. Identity Dina
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  'd1ea9999-9999-9999-9999-999999999999',
  'd1ea9999-9999-9999-9999-999999999999',
  jsonb_build_object('sub', 'd1ea9999-9999-9999-9999-999999999999', 'email', 'dina@ablework.com', 'email_verified', true),
  'email',
  'd1ea9999-9999-9999-9999-999999999999',
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'd1ea9999-9999-9999-9999-999999999999'
);


-- 6. Tambahkan Data Detail ke public.profiles
-- A. Profil Sinta
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  disability_type,
  accessibility_needs,
  bio,
  skills,
  experience,
  education,
  avatar,
  working_style,
  target_careers,
  location,
  portfolios,
  certificates
)
VALUES (
  'de32252a-995a-4bbf-85f0-5c6218d6e3c1',
  'Sinta',
  'sinta@ablework.com',
  'Neurodivergent (ADHD & Autisme)',
  ARRAY['written_instruction', 'quiet_environment', 'flexible_hours', 'remote'],
  'Saya tertarik pada pekerjaan administrasi dan pelayanan pelanggan. Saya memiliki kemampuan komunikasi tertulis dan nyaman bekerja dengan tugas yang terstruktur.',
  ARRAY['Data Entry', 'Microsoft Office', 'Google Workspace', 'Admin Online', 'Desain Canva', 'Komunikasi', 'Kerjasama Tim', 'Problem Solving'],
  'Magang Admin 6 Bulan di UMKM Lokal',
  'SMK Administrasi Perkantoran',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  ARRAY['structured_task', 'independent_work', 'written_communication'],
  ARRAY['Admin Online', 'Customer Support', 'Data Entry'],
  'Jakarta',
  '[{"title": "Desain Konten Sosmed UMKM", "role": "Graphic Design", "tool": "Canva & Figma", "img": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300", "link": "https://figma.com"}, {"title": "Data Entry & Dashboard Spreadsheet", "role": "Data Entry", "tool": "Google Sheets", "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300", "link": "https://google.com"}]'::jsonb,
  '[{"title": "Sertifikat Kelulusan Dasar Pengolahan Data Excel", "issuer": "AbleWork Academy", "date": "Juni 2026", "link": "https://excel.com"}, {"title": "Pelatihan Customer Service Chat & Bisnis Online", "issuer": "Karya Setara", "date": "April 2026", "link": "https://karyasetara.com"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  disability_type = EXCLUDED.disability_type,
  accessibility_needs = EXCLUDED.accessibility_needs,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  experience = EXCLUDED.experience,
  education = EXCLUDED.education,
  avatar = EXCLUDED.avatar,
  working_style = EXCLUDED.working_style,
  target_careers = EXCLUDED.target_careers,
  location = EXCLUDED.location,
  portfolios = EXCLUDED.portfolios,
  certificates = EXCLUDED.certificates;

-- B. Profil Budi
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  disability_type,
  accessibility_needs,
  bio,
  skills,
  experience,
  education,
  avatar,
  working_style,
  target_careers,
  location,
  portfolios,
  certificates
)
VALUES (
  'b00d1e34-995a-4bbf-85f0-5c6218d6e3c2',
  'Budi',
  'budi@ablework.com',
  'Disabilitas Fisik (Pengguna Kursi Roda)',
  ARRAY['wheelchair_access', 'flexible_hours', 'remote'],
  'Desainer Grafis lepas yang ingin mencari tantangan kerja tetap secara hybrid. Membutuhkan akses gedung ramah kursi roda dan toilet aksesibel.',
  ARRAY['Desain Canva', 'Adobe Illustrator', 'Photoshop', 'Desain Media Sosial', 'Komunikasi', 'Kerjasama Tim'],
  'Freelance Graphic Designer selama 2 Tahun',
  'D3 Desain Komunikasi Visual',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  ARRAY['independent_work', 'team_collaboration', 'quiet_environment'],
  ARRAY['Junior Graphic Designer', 'Content Admin UMKM'],
  'Bandung',
  '[{"title": "Redesign Landing Page AbleWork", "role": "UI/UX Designer", "tool": "Figma", "img": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300", "link": "https://figma.com"}, {"title": "Desain Poster Edukasi Aksesibilitas", "role": "Graphic Designer", "tool": "Canva", "img": "https://images.unsplash.com/photo-1572044162444-ad60f128bde3?w=300", "link": "https://canva.com"}]'::jsonb,
  '[{"title": "Sertifikat Adobe Certified Professional in Visual Design", "issuer": "Adobe", "date": "Mei 2025", "link": "https://adobe.com"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  disability_type = EXCLUDED.disability_type,
  accessibility_needs = EXCLUDED.accessibility_needs,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  experience = EXCLUDED.experience,
  education = EXCLUDED.education,
  avatar = EXCLUDED.avatar,
  working_style = EXCLUDED.working_style,
  target_careers = EXCLUDED.target_careers,
  location = EXCLUDED.location,
  portfolios = EXCLUDED.portfolios,
  certificates = EXCLUDED.certificates;

-- C. Profil Adi
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  disability_type,
  accessibility_needs,
  bio,
  skills,
  experience,
  education,
  avatar,
  working_style,
  target_careers,
  location,
  portfolios,
  certificates
)
VALUES (
  'ad12252a-995a-4bbf-85f0-5c6218d6e3c3',
  'Adi',
  'adi@ablework.com',
  'Tuli / Hard of Hearing',
  ARRAY['caption_meeting', 'chat_communication', 'written_instruction', 'remote'],
  'Spesialis Customer Support berbasis chat yang berpengalaman merespons komplain pelanggan dengan ramah dan cepat. Berkomunikasi optimal menggunakan teks tertulis.',
  ARRAY['Customer Service Chat', 'Input Data', 'Microsoft Excel', 'Email Writing', 'Komunikasi', 'Problem Solving'],
  'Customer Service Chat Staff di Toko Online (1 Tahun)',
  'S1 Sastra Inggris',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  ARRAY['structured_task', 'written_communication', 'quiet_environment'],
  ARRAY['Customer Support Chat', 'Data Entry Assistant'],
  'Surabaya',
  '[{"title": "Penanganan 500+ Chat Komplain Pelanggan", "role": "Customer Support", "tool": "WhatsApp Business", "img": "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=300", "link": "https://whatsapp.com"}]'::jsonb,
  '[{"title": "Pelatihan Komunikasi Efektif Tertulis", "issuer": "AbleWork Academy", "date": "Februari 2026", "link": "https://ablework.id"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  disability_type = EXCLUDED.disability_type,
  accessibility_needs = EXCLUDED.accessibility_needs,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  experience = EXCLUDED.experience,
  education = EXCLUDED.education,
  avatar = EXCLUDED.avatar,
  working_style = EXCLUDED.working_style,
  target_careers = EXCLUDED.target_careers,
  location = EXCLUDED.location,
  portfolios = EXCLUDED.portfolios,
  certificates = EXCLUDED.certificates;

-- D. Profil Dina (100% Progress & 100% Match for Admin Online)
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  disability_type,
  accessibility_needs,
  bio,
  skills,
  experience,
  education,
  avatar,
  working_style,
  target_careers,
  location,
  portfolios,
  certificates
)
VALUES (
  'd1ea9999-9999-9999-9999-999999999999',
  'Dina',
  'dina@ablework.com',
  'Tidak ada / Lebih suka tidak menyebutkan',
  ARRAY['remote', 'written_instruction'],
  'Saya seorang profesional administrasi yang teliti, terorganisir, dan berfokus pada hasil. Siap memberikan dukungan operasional terbaik secara remote.',
  ARRAY['Data Entry', 'Microsoft Office', 'Admin Online', 'komunikasi', 'kerjasama tim'],
  '1 Tahun Pengalaman Kerja',
  'S1 Administrasi Perkantoran',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  ARRAY['structured_task', 'independent_work'],
  ARRAY['Admin Online'],
  'Jakarta',
  '[{"title": "Sistem Arsip Digital Kantor", "role": "Administrative Assistant", "tool": "Google Drive & Notion", "img": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300", "link": "https://notion.so"}]'::jsonb,
  '[{"title": "Sertifikat Kompetensi Administrasi Perkantoran", "issuer": "BNSP", "date": "Maret 2026", "link": "https://bnsp.go.id"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  disability_type = EXCLUDED.disability_type,
  accessibility_needs = EXCLUDED.accessibility_needs,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  experience = EXCLUDED.experience,
  education = EXCLUDED.education,
  avatar = EXCLUDED.avatar,
  working_style = EXCLUDED.working_style,
  target_careers = EXCLUDED.target_careers,
  location = EXCLUDED.location,
  portfolios = EXCLUDED.portfolios,
  certificates = EXCLUDED.certificates;

-- ============================================================
-- 4. UPDATE UNTUK MENJAMIN SEMUA AKUN LAIN MEMILIKI DEFAULT
-- ============================================================
-- Query di bawah ini menjamin seluruh akun yang terdaftar (seperti budi.test@example.com, dll) 
-- memiliki data default awal jika saat ini masih kosong/NULL.

UPDATE public.profiles
SET portfolios = '[
  {
    "title": "Desain Konten Sosmed UMKM", 
    "role": "Graphic Design", 
    "tool": "Canva & Figma", 
    "img": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300", 
    "link": "https://figma.com"
  }, 
  {
    "title": "Data Entry & Dashboard Spreadsheet", 
    "role": "Data Entry", 
    "tool": "Google Sheets", 
    "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300", 
    "link": "https://docs.google.com"
  }
]'::jsonb
WHERE portfolios IS NULL OR portfolios = '[]'::jsonb OR jsonb_array_length(portfolios) = 0;

UPDATE public.profiles
SET certificates = '[
  {
    "title": "Sertifikat Kelulusan Dasar Pengolahan Data Excel", 
    "issuer": "AbleWork Academy", 
    "date": "Juni 2026", 
    "link": "https://ablework.id"
  }, 
  {
    "title": "Pelatihan Customer Service Chat & Bisnis Online", 
    "issuer": "Karya Setara", 
    "date": "April 2026", 
    "link": "https://karyasetara.org"
  }
]'::jsonb
WHERE certificates IS NULL OR certificates = '[]'::jsonb OR jsonb_array_length(certificates) = 0;


-- ============================================================
-- 5. SETUP SUPABASE STORAGE BUCKET & RLS POLICIES
-- ============================================================
-- Bagian ini otomatis membuat bucket "portfolios" dan mengatur 
-- kebijakan keamanan (RLS) agar aplikasi bisa mengunggah & membaca gambar.

-- A. Buat bucket "portfolios" jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- B. Kebijakan mengizinkan siapa saja (anonim & terautentikasi) mengunggah file ke bucket "portfolios"
DROP POLICY IF EXISTS "Izinkan upload portofolio untuk semua" ON storage.objects;
CREATE POLICY "Izinkan upload portofolio untuk semua"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'portfolios');

-- C. Kebijakan mengizinkan siapa saja melihat file di bucket "portfolios"
DROP POLICY IF EXISTS "Izinkan baca portofolio untuk semua" ON storage.objects;
CREATE POLICY "Izinkan baca portofolio untuk semua"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolios');


-- ============================================================
-- 5. Tabel public.saved_jobs untuk menyimpan lowongan favorit
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  job_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Aktifkan RLS pada saved_jobs
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Policies) untuk saved_jobs
DROP POLICY IF EXISTS "User dapat membaca lowongan favorit sendiri" ON public.saved_jobs;
CREATE POLICY "User dapat membaca lowongan favorit sendiri"
  ON public.saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat menyimpan lowongan favorit" ON public.saved_jobs;
CREATE POLICY "User dapat menyimpan lowongan favorit"
  ON public.saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat menghapus lowongan favorit sendiri" ON public.saved_jobs;
CREATE POLICY "User dapat menghapus lowongan favorit sendiri"
  ON public.saved_jobs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. Tabel public.chat_messages untuk menyimpan pesan chat
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recruiter_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'recruiter')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Aktifkan RLS pada chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Policies) untuk chat_messages
DROP POLICY IF EXISTS "User dapat membaca pesan chat sendiri" ON public.chat_messages;
CREATE POLICY "User dapat membaca pesan chat sendiri"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat mengirim pesan chat" ON public.chat_messages;
CREATE POLICY "User dapat mengirim pesan chat"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 7. Tabel public.job_applications untuk tracking lamaran kerja
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  job_id TEXT NOT NULL,
  template_text TEXT,
  applied_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied', 'review', 'interview', 'accepted', 'rejected')),
  UNIQUE(user_id, job_id)
);

-- Aktifkan RLS pada job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Policies) untuk job_applications
DROP POLICY IF EXISTS "User dapat membaca lamaran sendiri" ON public.job_applications;
CREATE POLICY "User dapat membaca lamaran sendiri"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat mengirim lamaran" ON public.job_applications;
CREATE POLICY "User dapat mengirim lamaran"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat memperbarui status lamaran sendiri" ON public.job_applications;
CREATE POLICY "User dapat memperbarui status lamaran sendiri"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat menghapus lamaran sendiri" ON public.job_applications;
CREATE POLICY "User dapat menghapus lamaran sendiri"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 8. SEED DATA — Lamaran & Pesan Otomatis untuk setiap akun
-- ============================================================
-- Setiap user mendapatkan 5 lamaran kerja, masing-masing
-- dengan status yang berbeda agar halaman Lacak Lamaran terisi.
--
-- Status mapping per job_id:
--   job_id "1" (Admin Online)             → applied
--   job_id "2" (Junior Graphic Designer)  → review
--   job_id "3" (Data Entry Assistant)     → interview
--   job_id "4" (Customer Support Chat)    → accepted
--   job_id "5" (Content Admin UMKM)       → rejected
-- ============================================================

-- ── A. SINTA (de32252a-995a-4bbf-85f0-5c6218d6e3c1) ────────

INSERT INTO public.job_applications (user_id, job_id, template_text, applied_at, status)
VALUES
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '1', 'Saya membutuhkan instruksi kerja tertulis dan lingkungan yang tenang.', now() - interval '5 days', 'applied'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '2', 'Saya membutuhkan jam kerja fleksibel dan bisa bekerja dari rumah.', now() - interval '10 days', 'review'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '3', 'Saya memerlukan screen reader dan instruksi kerja tertulis.', now() - interval '15 days', 'interview'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '4', 'Saya nyaman komunikasi berbasis chat dan tidak memerlukan telepon.', now() - interval '20 days', 'accepted'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '5', 'Saya membutuhkan remote work dan panduan tugas tertulis.', now() - interval '25 days', 'rejected')
ON CONFLICT (user_id, job_id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO public.chat_messages (user_id, recruiter_id, sender, message, created_at)
VALUES
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '1', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Admin Online di PT Ruang Inklusif. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '5 days'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '2', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Junior Graphic Designer di Studio Setara. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '10 days'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '3', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Data Entry Assistant di Karya Digital. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '15 days'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '4', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Customer Support Chat di Layanan Prima. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '20 days'),
  ('de32252a-995a-4bbf-85f0-5c6218d6e3c1', '5', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Content Admin UMKM di LokalMart. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '25 days')
ON CONFLICT DO NOTHING;

-- ── B. BUDI (b00d1e34-995a-4bbf-85f0-5c6218d6e3c2) ─────────

INSERT INTO public.job_applications (user_id, job_id, template_text, applied_at, status)
VALUES
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '1', 'Saya membutuhkan akses kursi roda dan opsi remote/hybrid.', now() - interval '4 days', 'applied'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '2', 'Saya perlu gedung aksesibel kursi roda dan jam kerja fleksibel.', now() - interval '9 days', 'review'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '3', 'Saya bisa bekerja remote dengan panduan tertulis yang jelas.', now() - interval '14 days', 'interview'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '4', 'Saya nyaman bekerja berbasis teks dari rumah.', now() - interval '19 days', 'accepted'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '5', 'Saya tertarik posisi ini dan bisa bekerja secara remote.', now() - interval '24 days', 'rejected')
ON CONFLICT (user_id, job_id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO public.chat_messages (user_id, recruiter_id, sender, message, created_at)
VALUES
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '1', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Admin Online di PT Ruang Inklusif. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '4 days'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '2', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Junior Graphic Designer di Studio Setara. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '9 days'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '3', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Data Entry Assistant di Karya Digital. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '14 days'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '4', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Customer Support Chat di Layanan Prima. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '19 days'),
  ('b00d1e34-995a-4bbf-85f0-5c6218d6e3c2', '5', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Content Admin UMKM di LokalMart. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '24 days')
ON CONFLICT DO NOTHING;

-- ── C. ADI (ad12252a-995a-4bbf-85f0-5c6218d6e3c3) ──────────

INSERT INTO public.job_applications (user_id, job_id, template_text, applied_at, status)
VALUES
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '1', 'Saya membutuhkan komunikasi berbasis chat dan instruksi tertulis.', now() - interval '3 days', 'applied'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '2', 'Saya memerlukan caption otomatis di setiap rapat video.', now() - interval '8 days', 'review'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '3', 'Saya bekerja optimal dengan instruksi tertulis dan bisa remote.', now() - interval '13 days', 'interview'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '4', 'Saya sangat cocok untuk posisi ini karena komunikasi berbasis chat.', now() - interval '18 days', 'accepted'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '5', 'Saya tertarik bekerja remote dengan komunikasi tertulis.', now() - interval '23 days', 'rejected')
ON CONFLICT (user_id, job_id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO public.chat_messages (user_id, recruiter_id, sender, message, created_at)
VALUES
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '1', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Admin Online di PT Ruang Inklusif. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '3 days'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '2', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Junior Graphic Designer di Studio Setara. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '8 days'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '3', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Data Entry Assistant di Karya Digital. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '13 days'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '4', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Customer Support Chat di Layanan Prima. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '18 days'),
  ('ad12252a-995a-4bbf-85f0-5c6218d6e3c3', '5', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Content Admin UMKM di LokalMart. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '23 days')
ON CONFLICT DO NOTHING;

-- ── D. DINA (d1ea9999-9999-9999-9999-999999999999) ──────────

INSERT INTO public.job_applications (user_id, job_id, template_text, applied_at, status)
VALUES
  ('d1ea9999-9999-9999-9999-999999999999', '1', 'Saya membutuhkan opsi remote dan instruksi kerja yang tertulis jelas.', now() - interval '2 days', 'applied'),
  ('d1ea9999-9999-9999-9999-999999999999', '2', 'Saya tertarik posisi desainer dan bisa bekerja hybrid.', now() - interval '7 days', 'review'),
  ('d1ea9999-9999-9999-9999-999999999999', '3', 'Saya mampu bekerja mandiri dari rumah dengan panduan tertulis.', now() - interval '12 days', 'interview'),
  ('d1ea9999-9999-9999-9999-999999999999', '4', 'Saya menyukai komunikasi berbasis teks dan bisa bekerja remote.', now() - interval '17 days', 'accepted'),
  ('d1ea9999-9999-9999-9999-999999999999', '5', 'Saya membutuhkan remote work dan jadwal kerja yang terstruktur.', now() - interval '22 days', 'rejected')
ON CONFLICT (user_id, job_id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO public.chat_messages (user_id, recruiter_id, sender, message, created_at)
VALUES
  ('d1ea9999-9999-9999-9999-999999999999', '1', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Admin Online di PT Ruang Inklusif. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '2 days'),
  ('d1ea9999-9999-9999-9999-999999999999', '2', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Junior Graphic Designer di Studio Setara. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '7 days'),
  ('d1ea9999-9999-9999-9999-999999999999', '3', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Data Entry Assistant di Karya Digital. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '12 days'),
  ('d1ea9999-9999-9999-9999-999999999999', '4', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Customer Support Chat di Layanan Prima. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '17 days'),
  ('d1ea9999-9999-9999-9999-999999999999', '5', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Content Admin UMKM di LokalMart. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '22 days')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 9. SEED DATA — Akun yudistira@gmail.com
-- ============================================================
-- Menggunakan subquery agar tidak perlu hardcode UUID.
-- Script ini aman dijalankan berulang (idempotent).
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Ambil UUID berdasarkan email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'yudistira@gmail.com'
  LIMIT 1;

  -- Hentikan jika akun tidak ditemukan
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User yudistira@gmail.com tidak ditemukan. Lewati seed data.';
    RETURN;
  END IF;

  -- ── Tambahkan ke public.profiles jika belum ada ──
  INSERT INTO public.profiles (id, full_name, email, disability_type, accessibility_needs,
    bio, skills, experience, education, working_style, target_careers, location, portfolios, certificates)
  VALUES (
    v_user_id,
    'Yudistira',
    'yudistira@gmail.com',
    'Umum',
    ARRAY['remote', 'written_instruction'],
    'Profesional muda yang antusias dan siap berkembang dalam dunia kerja digital.',
    ARRAY['Komunikasi', 'Microsoft Office', 'Data Entry', 'Admin Online'],
    'Fresh Graduate',
    'S1 Manajemen',
    ARRAY['structured_task', 'independent_work'],
    ARRAY['Admin Online', 'Customer Support'],
    'Jakarta',
    '[{"title": "Laporan Kerja Praktik Digital Marketing", "role": "Researcher", "tool": "Google Docs", "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300", "link": "https://google.com"}]'::jsonb,
    '[{"title": "Sertifikat Digital Marketing Dasar", "issuer": "AbleWork Academy", "date": "Mei 2026", "link": "https://ablework.id"}]'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;

  -- ── job_applications: 1 per status ──
  INSERT INTO public.job_applications (user_id, job_id, template_text, applied_at, status)
  VALUES
    (v_user_id, '1', 'Saya membutuhkan panduan kerja tertulis dan opsi remote.', now() - interval '3 days',  'applied'),
    (v_user_id, '2', 'Saya tertarik posisi ini dan siap bekerja hybrid.', now() - interval '8 days',         'review'),
    (v_user_id, '3', 'Saya bisa bekerja remote dengan disiplin tinggi.', now() - interval '13 days',         'interview'),
    (v_user_id, '4', 'Saya nyaman berkomunikasi berbasis teks dan chat.', now() - interval '18 days',        'accepted'),
    (v_user_id, '5', 'Saya siap bekerja remote dan terstruktur.', now() - interval '23 days',               'rejected')
  ON CONFLICT (user_id, job_id) DO UPDATE SET status = EXCLUDED.status;

  -- ── chat_messages: pesan otomatis ke masing-masing rekruter ──
  INSERT INTO public.chat_messages (user_id, recruiter_id, sender, message, created_at)
  VALUES
    (v_user_id, '1', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Admin Online di PT Ruang Inklusif. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '3 days'),
    (v_user_id, '2', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Junior Graphic Designer di Studio Setara. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '8 days'),
    (v_user_id, '3', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Data Entry Assistant di Karya Digital. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '13 days'),
    (v_user_id, '4', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Customer Support Chat di Layanan Prima. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '18 days'),
    (v_user_id, '5', 'user', 'Halo! Saya baru saja mengirimkan lamaran untuk posisi Content Admin UMKM di LokalMart. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut. Terima kasih!', now() - interval '23 days')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed data untuk yudistira@gmail.com (%) berhasil ditambahkan.', v_user_id;
END;
$$;


-- ============================================================
-- 10. HAPUS lamaran status "interview" untuk yudistira@gmail.com
-- ============================================================
-- Jalankan hanya snippet di bawah ini di SQL Editor untuk
-- menghapus baris interview tanpa perlu jalankan ulang file.
-- ============================================================

DELETE FROM public.job_applications
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'yudistira@gmail.com'
  LIMIT 1
)
AND job_id = '3'
AND status = 'interview';
