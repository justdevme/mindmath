# MindMath — App học sinh

Ứng dụng di động dành cho học sinh theo dõi bài tập, tiến độ học tập và kết quả kiểm tra, xây dựng bằng **Expo (React Native) + TypeScript + Expo Router**. Giao diện và luồng nghiệp vụ dựa theo thiết kế MindMath (tông đỏ–kem).

## Tính năng chính

- **Trang chủ** — chuỗi ngày học, điểm tích lũy, điểm TB tháng, bài tập sắp đến hạn, buổi học tiếp theo, biểu đồ hoạt động tuần.
- **Tiến độ học tập** — điểm trung bình theo kỳ (Tháng này / Học kỳ I / Cả năm), biểu đồ điểm 6 bài kiểm tra gần nhất, mức độ thành thạo theo chủ đề, lịch sử kiểm tra đầy đủ.
- **Bài tập về nhà** — danh sách Cần làm / Đã nộp / Đã chấm, lọc theo môn học, chi tiết bài tập, nộp bài (chụp ảnh hoặc chọn tệp), xem kết quả chấm điểm kèm nhận xét của giáo viên, xem lời giải câu sai, luyện tập bài tương tự.
- **Cá nhân** — thông tin cá nhân, phụ huynh liên kết, cài đặt thông báo, đổi mật khẩu, trợ giúp & phản hồi.
- **Thông báo** — trung tâm thông báo với trạng thái đã đọc/chưa đọc.

Trạng thái bài tập (Cần làm → Đã nộp → Đã chấm) được quản lý qua `AssignmentsContext` (`store/AssignmentsContext.tsx`), nên khi nộp bài, danh sách và trang chủ cập nhật ngay lập tức trong phiên sử dụng.

> Dữ liệu hiện là dữ liệu mẫu (`data/mock.ts`), chưa kết nối backend thật.

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyến nghị bản LTS mới nhất)
- Điện thoại cài sẵn app **Expo Go** (để chạy nhanh không cần build native), hoặc Xcode/Android Studio nếu muốn build native.

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
  (tabs)/              4 tab chính: Trang chủ, Tiến độ, Bài tập, Cá nhân
  homework/[id]/       Chi tiết bài tập, nộp bài, kết quả, lời giải, luyện tập
  notifications.tsx, personal-info.tsx, ...   Các màn phụ (thông báo, hồ sơ...)
components/           Các thành phần dùng chung (Card, Badge, ProgressBar, BarChart, Avatar)
data/                 Dữ liệu mẫu (mock.ts) và ngân hàng câu hỏi luyện tập (practice.ts)
store/                State toàn cục (AssignmentsContext)
hooks/                Custom hooks (useCountdown)
theme/                Màu sắc, spacing, typography dùng chung
```

## Ghi chú kỹ thuật

- `expo-router`, `expo-constants`, `expo-linking` được ghim theo phiên bản gắn với SDK Expo hiện tại (57.x) — không dùng dòng version cũ trước đây của các gói này.
- `.npmrc` bật `legacy-peer-deps=true` để `npm install` chạy mượt dù còn một vài peer dependency lệch phiên bản giữa các gói Expo (vấn đề phổ biến trong hệ sinh thái Expo, không ảnh hưởng runtime).
