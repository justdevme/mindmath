import { Assignment } from './mock';

export type PracticeQuestion = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

const bank: Record<Assignment['subject'], PracticeQuestion[]> = {
  'Hình học': [
    {
      prompt:
        'Tam giác ABC có đường tròn nội tiếp (I) tiếp xúc BC, CA, AB lần lượt tại D, E, F. Biết AB = 7, BC = 8, CA = 9. Độ dài AF bằng bao nhiêu?',
      choices: ['3', '4', '5', '6'],
      correctIndex: 2,
      explanation:
        'AF = AE = (AB + CA − BC)/2 = (7 + 9 − 8)/2 = 4. Kiểm tra lại: nửa chu vi p = (7+8+9)/2 = 12, AF = p − BC = 12 − 8 = 4.',
    },
    {
      prompt: 'Cho tam giác ABC, đường thẳng DE // BC với D ∈ AB, E ∈ AC. Biết AD/AB = 3/5. Tỉ số DE/BC bằng?',
      choices: ['2/5', '3/5', '5/3', '5/2'],
      correctIndex: 1,
      explanation: 'Theo định lý Ta-lét, DE // BC nên DE/BC = AD/AB = 3/5.',
    },
  ],
  'Đại số': [
    {
      prompt: 'Hệ phương trình { x + y = 5; x − y = 1 } có nghiệm (x; y) là?',
      choices: ['(3; 2)', '(2; 3)', '(4; 1)', '(1; 4)'],
      correctIndex: 0,
      explanation: 'Cộng hai phương trình: 2x = 6 → x = 3, thay vào x + y = 5 → y = 2.',
    },
  ],
  'Số học': [
    {
      prompt: 'ƯCLN(36, 60) bằng bao nhiêu?',
      choices: ['6', '12', '18', '24'],
      correctIndex: 1,
      explanation: '36 = 2²·3², 60 = 2²·3·5 → ƯCLN = 2²·3 = 12.',
    },
  ],
  'Xác suất – Thống kê': [
    {
      prompt: 'Gieo một con xúc xắc cân đối. Xác suất để xuất hiện mặt có số chấm lớn hơn 4 là?',
      choices: ['1/6', '1/3', '1/2', '2/3'],
      correctIndex: 1,
      explanation: 'Các mặt thỏa mãn: 5, 6 → 2/6 = 1/3.',
    },
  ],
};

export function getPracticeQuestion(subject: Assignment['subject'], seed: number): PracticeQuestion {
  const list = bank[subject];
  return list[seed % list.length];
}
