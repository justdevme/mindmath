-- MindMath — Supabase schema
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → New query → Run.

-- ============ EXTENSIONS ============
create extension if not exists "pgcrypto";

-- ============ TABLES ============

-- Hồ sơ học sinh, 1-1 với auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  class_name text not null default '9A2',
  course_name text not null default 'Toán nâng cao',
  avatar_initials text not null default 'HS',
  streak_days int not null default 0,
  total_points int not null default 0,
  created_at timestamptz not null default now()
);

-- Bài tập được giao (nội dung dùng chung theo lớp)
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null,
  teacher_name text not null,
  questions_count int not null,
  due_at timestamptz not null,
  assigned_at timestamptz not null default now(),
  score_coefficient int not null default 1,
  submit_method text not null default 'Ảnh chụp bài làm',
  requirement text not null,
  requirement_notes text[] not null default '{}',
  attachment_name text,
  attachment_size text,
  attachment_pages int,
  class_name text not null default '9A2',
  solutions jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Bài học sinh nộp / đã được chấm cho từng bài tập
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'submitted' check (status in ('submitted', 'graded')),
  submitted_at timestamptz not null default now(),
  note text,
  files jsonb not null default '[]',
  score numeric(3,1),
  correct_count int,
  graded_at timestamptz,
  feedback_text text,
  feedback_tags text[] not null default '{}',
  question_results jsonb,
  unique (assignment_id, student_id)
);

-- Thông báo
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  icon text not null default 'document-text',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Lịch sử điểm kiểm tra (giáo viên nhập, ngoài luồng nộp bài online)
create table if not exists public.test_history (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  score numeric(3,1) not null,
  title text not null,
  test_date date not null,
  teacher_name text not null,
  topic text,
  created_at timestamptz not null default now()
);

-- ============ AUTO-CREATE PROFILE ON SIGN UP ============

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Học sinh'),
    upper(left(coalesce(new.raw_user_meta_data ->> 'full_name', 'Học sinh'), 1)) ||
      upper(left(split_part(coalesce(new.raw_user_meta_data ->> 'full_name', 'Học sinh'), ' ', -1), 1))
  );

  -- Dữ liệu demo cho tài khoản mới: thông báo mẫu
  insert into public.notifications (student_id, title, body, icon, read, created_at) values
    (new.id, 'Bài tập sắp đến hạn', '"Đường tròn nội tiếp tam giác" sắp đến hạn nộp bài.', 'document-text', false, now()),
    (new.id, 'Chào mừng đến với MindMath', 'Khám phá bài tập, theo dõi tiến độ và luyện tập ngay trong app.', 'trophy', false, now());

  -- Lịch sử điểm kiểm tra mẫu
  insert into public.test_history (student_id, score, title, test_date, teacher_name, topic) values
    (new.id, 8.8, 'Kiểm tra 45 phút · Đại số', current_date - 5, 'Thầy Tuấn', 'Đại số'),
    (new.id, 8.3, 'Kiểm tra 15 phút · Hình học', current_date - 12, 'Cô Lan', 'Hình học'),
    (new.id, 8.0, 'Kiểm tra 15 phút · Số học', current_date - 26, 'Cô Lan', 'Số học'),
    (new.id, 7.3, 'Kiểm tra 45 phút · Hình học', current_date - 40, 'Thầy Tuấn', 'Hình học'),
    (new.id, 7.6, 'Kiểm tra miệng · Đại số', current_date - 54, 'Thầy Tuấn', 'Đại số'),
    (new.id, 6.5, 'Kiểm tra 15 phút · Số học', current_date - 68, 'Cô Lan', 'Số học');

  -- Bài đã chấm mẫu, để tài khoản mới thấy ngay luồng "Đã chấm"
  insert into public.submissions
    (assignment_id, student_id, status, submitted_at, score, correct_count, graded_at, feedback_text, feedback_tags, question_results)
  select
    a.id, new.id, 'graded', now() - interval '2 days', 9.0, 11, now() - interval '1 day',
    'Em trình bày rõ ràng, hình vẽ chính xác và lập luận ở câu 9, 10 rất chặt. Câu 7 em áp dụng nhầm tỉ số của định lý Ta-lét đảo — xem lại phần lời giải thầy đính kèm rồi làm lại một bài tương tự nhé.',
    array['Trình bày tốt', 'Cần xem lại câu 7'],
    (select jsonb_agg(jsonb_build_object('number', n, 'correct', n <> 7)) from generate_series(1, 12) n)
  from public.assignments a
  where a.title = 'Định lý Ta-lét trong tam giác'
  limit 1;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ ROW LEVEL SECURITY ============

alter table public.profiles enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;
alter table public.test_history enable row level security;

-- profiles: mỗi học sinh chỉ đọc/sửa hồ sơ của chính mình
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- assignments: mọi người dùng đã đăng nhập đều đọc được (nội dung khoá học dùng chung)
create policy "assignments_select_authenticated" on public.assignments
  for select using (auth.role() = 'authenticated');

-- submissions: học sinh chỉ thấy/nộp bài của chính mình
create policy "submissions_select_own" on public.submissions
  for select using (auth.uid() = student_id);
create policy "submissions_insert_own" on public.submissions
  for insert with check (auth.uid() = student_id);
create policy "submissions_update_own" on public.submissions
  for update using (auth.uid() = student_id);

-- notifications: học sinh chỉ thấy/đánh dấu đã đọc thông báo của mình
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = student_id);
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = student_id);

-- test_history: học sinh chỉ đọc điểm của chính mình
create policy "test_history_select_own" on public.test_history
  for select using (auth.uid() = student_id);

-- ============ STORAGE (ảnh/tệp bài nộp) ============

insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "submission_files_read_own" on storage.objects
  for select using (bucket_id = 'submissions' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "submission_files_insert_own" on storage.objects
  for insert with check (bucket_id = 'submissions' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============ DỮ LIỆU MẪU (tuỳ chọn — sửa class_name nếu cần) ============

insert into public.assignments
  (subject, title, teacher_name, questions_count, due_at, assigned_at, requirement, requirement_notes, attachment_name, attachment_size, attachment_pages, class_name)
values
  ('Hình học', 'Đường tròn nội tiếp tam giác', 'Thầy Nguyễn Anh Tuấn', 12,
   now() + interval '6 hours', now() - interval '2 days',
   'Cho tam giác ABC có ba góc nhọn, đường tròn (I) nội tiếp tam giác tiếp xúc với BC, CA, AB lần lượt tại D, E, F. Hoàn thành 12 câu trong phiếu bài tập đính kèm, trình bày đầy đủ lập luận cho các câu chứng minh.',
   array['Câu 1 – 6: tính toán, ghi rõ công thức sử dụng.', 'Câu 7 – 10: chứng minh, mỗi bước nêu căn cứ.', 'Câu 11 – 12: vẽ hình bằng bút chì, ghi chú các điểm D, E, F.'],
   'phieu-bai-tap-buoi-12.pdf', '840 KB', 3, '9A2'),
  ('Đại số', 'Hệ phương trình bậc nhất hai ẩn', 'Thầy Tuấn', 8,
   now() + interval '2 days', now() - interval '1 day',
   'Giải các hệ phương trình bậc nhất hai ẩn bằng phương pháp thế và cộng đại số.',
   array['Trình bày rõ từng bước biến đổi.', 'Kết luận nghiệm cuối mỗi câu.'],
   'phieu-bai-tap-he-pt.pdf', '520 KB', 2, '9A2'),
  ('Số học', 'Ước chung lớn nhất và bội chung nhỏ nhất', 'Cô Lan', 10,
   now() + interval '3 days', now() - interval '1 day',
   'Tìm ƯCLN, BCNN của các nhóm số cho trước và áp dụng vào bài toán thực tế.',
   array['Ghi rõ phương pháp phân tích thừa số nguyên tố.'],
   'phieu-bai-tap-ucln-bcnn.pdf', '410 KB', 2, '9A2'),
  ('Xác suất – Thống kê', 'Bài tập ôn tập chương IX', 'Cô Lan', 15,
   now() + interval '6 days', now(),
   'Ôn tập toàn bộ chương Xác suất – Thống kê, hoàn thành 15 câu trắc nghiệm và tự luận.',
   array['Phần trắc nghiệm khoanh trực tiếp vào phiếu.', 'Phần tự luận trình bày ra giấy kẻ ô li.'],
   'on-tap-chuong-9.pdf', '610 KB', 4, '9A2');

-- Bài tập "Định lý Ta-lét" — luôn được seed sẵn kết quả đã chấm cho mỗi user mới (xem trigger phía trên)
insert into public.assignments
  (subject, title, teacher_name, questions_count, due_at, assigned_at, requirement, requirement_notes, attachment_name, attachment_size, attachment_pages, class_name, solutions)
values
  ('Hình học', 'Định lý Ta-lét trong tam giác', 'Thầy Nguyễn Anh Tuấn', 12,
   now() - interval '1 day', now() - interval '5 days',
   'Áp dụng định lý Ta-lét và Ta-lét đảo để chứng minh các hệ thức trong tam giác.',
   array['Trình bày đầy đủ lập luận cho các câu chứng minh.'],
   'phieu-bai-tap-talet.pdf', '480 KB', 2, '9A2',
   '{"7": "Câu 7 yêu cầu tính tỉ số DE/BC khi biết AD/AB = 2/5. Theo định lý Ta-lét: DE // BC nên DE/BC = AD/AB = 2/5, không phải AB/AD như em đã dùng. Từ đó DE = 2/5 · BC = 2/5 · 12 = 4,8 cm. Em xem lại chiều của tỉ số trước khi thay số nhé."}'::jsonb);
