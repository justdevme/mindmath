export type AssignmentStatus = 'todo' | 'submitted' | 'graded';

export type Assignment = {
  id: string;
  subject: 'Hình học' | 'Đại số' | 'Số học' | 'Xác suất – Thống kê';
  title: string;
  teacher: string;
  questionsCount: number;
  dueLabel: string;
  dueAt: string; // ISO string used for countdown
  assignedAt: string;
  status: AssignmentStatus;
  scoreCoefficient: number;
  submitMethod: string;
  requirement: string;
  requirementNotes: string[];
  attachment: { name: string; size: string; pages: number };
  progress?: { done: number; total: number };
  group: 'today' | 'week' | 'upcoming';
  timeLeftLabel?: string;
  // graded fields
  score?: number;
  correctCount?: number;
  submittedAt?: string;
  gradedAt?: string;
  onTime?: boolean;
  feedback?: {
    teacher: string;
    initials: string;
    text: string;
    at: string;
    tags: string[];
  };
  questionResults?: { number: number; correct: boolean }[];
};

export const student = {
  name: 'Minh Anh',
  initials: 'MA',
  className: '9A2',
  courseName: 'Toán nâng cao',
  streakDays: 12,
  totalPoints: 1240,
  monthlyAverage: 8.4,
  greetingDate: 'Thứ Năm, 17/09',
};

export const weeklyActivity = [
  { day: 'T2', value: 2 },
  { day: 'T3', value: 4 },
  { day: 'T4', value: 1 },
  { day: 'T5', value: 3 },
  { day: 'T6', value: 0 },
  { day: 'T7', value: 0 },
  { day: 'CN', value: 0 },
];

export const weeklySummary = {
  exercisesDone: 14,
  daysPracticed: 4,
  daysTotal: 7,
};

export const nextClass = {
  label: 'Hôm nay · 18:00 – 19:30',
  room: 'Phòng B2 · Hệ phương trình bậc nhất',
};

export const progressOverview = {
  average: 8.4,
  deltaFromLastMonth: 0.6,
  submitted: 18,
  onTimeRate: 94,
  rank: 4,
  classSize: 32,
};

export const recentScores = [
  { date: '12/07', score: 6.5 },
  { date: '26/07', score: 7.6 },
  { date: '09/08', score: 7.3 },
  { date: '23/08', score: 8.0 },
  { date: '06/09', score: 8.0 },
  { date: '13/09', score: 8.8 },
];

export const scoreTarget = 8.0;

export const topicMastery = [
  { topic: 'Số học', percent: 92, needsWork: false },
  { topic: 'Đại số', percent: 86, needsWork: false },
  { topic: 'Hình học', percent: 64, needsWork: false },
  { topic: 'Xác suất – Thống kê', percent: 41, needsWork: true },
];

export const testHistory = [
  { id: 't1', score: 8.8, title: 'Kiểm tra 45 phút · Đại số', date: '13/09', teacher: 'Thầy Tuấn' },
  { id: 't2', score: 8.3, title: 'Kiểm tra 15 phút · Hình học', date: '06/09', teacher: 'Cô Lan' },
];

export const assignments: Assignment[] = [
  {
    id: 'hh-duong-tron-noi-tiep',
    subject: 'Hình học',
    title: 'Đường tròn nội tiếp tam giác',
    teacher: 'Thầy Nguyễn Anh Tuấn',
    questionsCount: 12,
    dueLabel: 'Hạn 21:00 hôm nay',
    dueAt: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(),
    assignedAt: '15/09 · 19:30',
    status: 'todo',
    scoreCoefficient: 1,
    submitMethod: 'Ảnh chụp bài làm',
    requirement:
      'Cho tam giác ABC có ba góc nhọn, đường tròn (I) nội tiếp tam giác tiếp xúc với BC, CA, AB lần lượt tại D, E, F. Hoàn thành 12 câu trong phiếu bài tập đính kèm, trình bày đầy đủ lập luận cho các câu chứng minh.',
    requirementNotes: [
      'Câu 1 – 6: tính toán, ghi rõ công thức sử dụng.',
      'Câu 7 – 10: chứng minh, mỗi bước nêu căn cứ.',
      'Câu 11 – 12: vẽ hình bằng bút chì, ghi chú các điểm D, E, F.',
    ],
    attachment: { name: 'phieu-bai-tap-buoi-12.pdf', size: '840 KB', pages: 3 },
    group: 'today',
    timeLeftLabel: 'Còn 6 giờ',
  },
  {
    id: 'ds-he-phuong-trinh',
    subject: 'Đại số',
    title: 'Hệ phương trình bậc nhất hai ẩn',
    teacher: 'Thầy Tuấn',
    questionsCount: 8,
    dueLabel: 'Hạn 19/09',
    dueAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    assignedAt: '16/09 · 08:00',
    status: 'todo',
    scoreCoefficient: 1,
    submitMethod: 'Ảnh chụp bài làm',
    requirement: 'Giải các hệ phương trình bậc nhất hai ẩn bằng phương pháp thế và cộng đại số.',
    requirementNotes: ['Trình bày rõ từng bước biến đổi.', 'Kết luận nghiệm cuối mỗi câu.'],
    attachment: { name: 'phieu-bai-tap-he-pt.pdf', size: '520 KB', pages: 2 },
    progress: { done: 3, total: 8 },
    group: 'week',
    timeLeftLabel: 'Còn 2 ngày',
  },
  {
    id: 'sh-uoc-boi',
    subject: 'Số học',
    title: 'Ước chung lớn nhất và bội chung nhỏ nhất',
    teacher: 'Cô Lan',
    questionsCount: 10,
    dueLabel: 'Hạn 20/09',
    dueAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    assignedAt: '16/09 · 08:00',
    status: 'todo',
    scoreCoefficient: 1,
    submitMethod: 'Ảnh chụp bài làm',
    requirement: 'Tìm ƯCLN, BCNN của các nhóm số cho trước và áp dụng vào bài toán thực tế.',
    requirementNotes: ['Ghi rõ phương pháp phân tích thừa số nguyên tố.'],
    attachment: { name: 'phieu-bai-tap-ucln-bcnn.pdf', size: '410 KB', pages: 2 },
    group: 'week',
    timeLeftLabel: 'Còn 3 ngày',
  },
  {
    id: 'xs-on-tap-chuong-9',
    subject: 'Xác suất – Thống kê',
    title: 'Bài tập ôn tập chương IX',
    teacher: 'Cô Lan',
    questionsCount: 15,
    dueLabel: 'Hạn 23/09',
    dueAt: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    assignedAt: '17/09 · 08:00',
    status: 'todo',
    scoreCoefficient: 1,
    submitMethod: 'Ảnh chụp bài làm',
    requirement: 'Ôn tập toàn bộ chương Xác suất – Thống kê, hoàn thành 15 câu trắc nghiệm và tự luận.',
    requirementNotes: ['Phần trắc nghiệm khoanh trực tiếp vào phiếu.', 'Phần tự luận trình bày ra giấy kẻ ô li.'],
    attachment: { name: 'on-tap-chuong-9.pdf', size: '610 KB', pages: 4 },
    group: 'upcoming',
    timeLeftLabel: 'Còn 6 ngày',
  },
  {
    id: 'hh-dinh-ly-talet',
    subject: 'Hình học',
    title: 'Định lý Ta-lét trong tam giác',
    teacher: 'Thầy Nguyễn Anh Tuấn',
    questionsCount: 12,
    dueLabel: 'Đã chấm 16/09',
    dueAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    assignedAt: '12/09 · 19:30',
    status: 'graded',
    scoreCoefficient: 1,
    submitMethod: 'Ảnh chụp bài làm',
    requirement: 'Áp dụng định lý Ta-lét và Ta-lét đảo để chứng minh các hệ thức trong tam giác.',
    requirementNotes: ['Trình bày đầy đủ lập luận cho các câu chứng minh.'],
    attachment: { name: 'phieu-bai-tap-talet.pdf', size: '480 KB', pages: 2 },
    group: 'today',
    score: 9.0,
    correctCount: 11,
    submittedAt: '15/09',
    gradedAt: '16/09',
    onTime: true,
    feedback: {
      teacher: 'Thầy Nguyễn Anh Tuấn',
      initials: 'NT',
      text: 'Em trình bày rõ ràng, hình vẽ chính xác và lập luận ở câu 9, 10 rất chặt. Câu 7 em áp dụng nhầm tỉ số của định lý Ta-lét đảo — xem lại phần lời giải thầy đính kèm rồi làm lại một bài tương tự nhé.',
      at: '16/09 lúc 20:14',
      tags: ['Trình bày tốt', 'Cần xem lại câu 7'],
    },
    questionResults: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      correct: i + 1 !== 7,
    })),
  },
];

export const getAssignmentById = (id: string) => assignments.find((a) => a.id === id);
