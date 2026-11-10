import caioExams from './exams.json';
import caio2026Exams from './caio-2026-exams.json';
import cjaioExams from './cjaio-exams.json';
import cjaioDrills from './cjaio-drills.json';
import type { Exam } from '@/types';

// Keep existing CAIO IDs stable so saved attempts and question books still resolve.
const exams: Exam[] = [
  ...caioExams.map(exam => ({ ...exam, competition: 'CAIO', durationMinutes: 90 } as Exam)),
  ...caio2026Exams as Exam[],
  ...cjaioExams as Exam[],
  ...cjaioDrills as Exam[],
];

export default exams;
