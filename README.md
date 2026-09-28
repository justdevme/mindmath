# MindMath — App học sinh

Ứng dụng di động dành cho học sinh theo dõi bài tập, tiến độ học tập và kết quả kiểm tra, xây dựng bằng **Expo (React Native) + TypeScript + Expo Router**, backend là **Supabase** (Postgres + Auth + Storage). Giao diện và luồng nghiệp vụ dựa theo thiết kế MindMath (tông đỏ–kem).

## Tính năng chính

- **Đăng ký / Đăng nhập** bằng email + mật khẩu (Supabase Auth).
- **Trang chủ** — chuỗi ngày học, điểm tích lũy, điểm TB tháng (tính từ dữ liệu thật), bài tập sắp đến hạn, biểu đồ hoạt động tuần (dựa trên các lần nộp bài thật).
- **Tiến độ học tập** — điểm trung bình theo kỳ (Tháng này / Học kỳ I / Cả năm), biểu đồ điểm các bài kiểm tra gần nhất, mức độ thành thạo theo chủ đề, lịch sử kiểm tra đầy đủ.
- **Bài tập về nhà** — danh sách Cần làm / Đã nộp / Đã chấm, lọc theo môn học, chi tiết bài tập, nộp bài thật (chụp ảnh/chọn tệp → tải lên Supabase Storage), xem kết quả chấm điểm kèm nhận xét giáo viên, xem lời giải câu sai, luyện tập bài tương tự.
- **Cá nhân** — thông tin cá nhân, phụ huynh liên kết, cài đặt thông báo, đổi mật khẩu (xác thực qua Supabase Auth), trợ giúp & phản hồi.
- **Thông báo** — trung tâm thông báo thật, đồng bộ trạng thái đã đọc/chưa đọc lên server.

Mỗi tài khoản mới đăng ký sẽ tự động có sẵn dữ liệu demo (thông báo, lịch sử điểm, một bài đã được chấm) nhờ trigger trong database — trải nghiệm ngay từ lần đăng nhập đầu tiên mà không cần thao tác thêm.

## Kiến trúc backend (Supabase)

- **Auth**: email + mật khẩu, mỗi user có 1 hàng `profiles` tự tạo qua trigger `on_auth_user_created`.
- **Database**: `assignments` (bài tập dùng chung theo lớp), `submissions` (bài nộp/chấm của từng học sinh), `notifications`, `test_history`. Toàn bộ đều bật **Row Level Security** — học sinh chỉ đọc/ghi được dữ liệu của chính mình.
- **Storage**: bucket `submissions` lưu ảnh/tệp bài làm học sinh nộp, mỗi user chỉ truy cập được thư mục của mình.
- Schema đầy đủ nằm ở [`supabase/schema.sql`](./supabase/schema.sql).

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyến nghị bản LTS mới nhất)
- Điện thoại cài sẵn app **Expo Go** (để chạy nhanh không cần build native), hoặc Xcode/Android Studio nếu muốn build native.
- Một project [Supabase](https://supabase.com) (miễn phí).

## Thiết lập Supabase (chỉ cần làm 1 lần)

1. Tạo project mới tại [supabase.com](https://supabase.com).
2. Vào **SQL Editor** → dán toàn bộ nội dung file [`supabase/schema.sql`](./supabase/schema.sql) → **Run**.
3. Vào **Project Settings → API**, lấy **Project URL** và **anon/publishable key**.
4. Copy `.env.example` thành `.env`, điền 2 giá trị trên:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ... (hoặc sb_publishable_...)
   ```
   ⚠️ Không bao giờ dùng `service_role`/`secret` key trong app di động — key đó có toàn quyền, chỉ dùng trên server tin cậy.

## Cài đặt & chạy

```bash
npm install
npx expo start
```

Quét mã QR hiện ra bằng app Expo Go (iOS/Android) để mở app trên điện thoại, hoặc:

```bash
npx expo start --ios      # cần macOS + Xcode
npx expo start --android  # cần Android Studio / máy ảo
npx expo start --web      # chạy thử trên trình duyệt
```

## Kiểm tra chất lượng code

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

## Cấu trúc thư mục

```
app/                  Toàn bộ màn hình, định tuyến bằng Expo Router
  (auth)/              Đăng nhập, đăng ký
  (tabs)/              4 tab chính: Trang chủ, Tiến độ, Bài tập, Cá nhân
  homework/[id]/       Chi tiết bài tập, nộp bài, kết quả, lời giải, luyện tập
  notifications.tsx, personal-info.tsx, ...   Các màn phụ (thông báo, hồ sơ...)
components/           Các thành phần dùng chung (Card, Badge, ProgressBar, BarChart, Avatar)
data/                 Ngân hàng câu hỏi luyện tập tĩnh (practice.ts)
store/                State toàn cục (AuthContext, AssignmentsContext, NotificationsContext)
hooks/                Custom hooks lấy/tính dữ liệu (useProgressStats, useGradedResults, ...)
lib/                  Supabase client, kiểu dữ liệu database, hàm tính tiến độ
supabase/             schema.sql — toàn bộ database schema + RLS policies
theme/                Màu sắc, spacing, typography dùng chung
```

## Ghi chú kỹ thuật

- `expo-router`, `expo-constants`, `expo-linking` được ghim theo phiên bản gắn với SDK Expo hiện tại (57.x) — không dùng dòng version cũ trước đây của các gói này.
- `.npmrc` bật `legacy-peer-deps=true` để `npm install` chạy mượt dù còn một vài peer dependency lệch phiên bản giữa các gói Expo (vấn đề phổ biến trong hệ sinh thái Expo, không ảnh hưởng runtime).
- `react-dom` được ghim đúng bằng version của `react` để tránh lỗi "React version mismatch" khi chạy trên web.
