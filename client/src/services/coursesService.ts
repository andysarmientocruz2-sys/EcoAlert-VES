export type CourseStatus = 'pendiente' | 'en_progreso' | 'completado';

export interface CourseProgress {
  status: CourseStatus;
  completedLessons: string[];
  lastLesson: string | null;
  pointsAwarded: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface LessonInput {
  moduleName: string;
  title: string;
}

export interface CompleteLessonResult {
  newlyCompleted: boolean;
  courseCompleted: boolean;
  progressPct: number;
  pointsEarned: number;
}

const COURSES_KEY = 'ecoalert_courses';
const LEARNING_POINTS_KEY = 'ecoalert_learning_points';
const QUIZ_STATS_KEY = 'ecoalert_quiz_stats';

function getAllLessons(courses: { id: string; modules: { name: string; lessons: string[] }[] }[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const course of courses) {
    result[course.id] = course.modules.flatMap((m) => m.lessons);
  }
  return result;
}

export interface QuizStats {
  attempts: number;
  perfectQuizzes: number;
  bestScore: number;
  totalPointsEarned: number;
  lastDate: string | null;
}

class CoursesService {
  private lessonsByCourse: Record<string, string[]> = {};

  init(courses: { id: string; modules: { name: string; lessons: string[] }[] }[]): void {
    this.lessonsByCourse = getAllLessons(courses);
  }

  getAllProgress(): Record<string, CourseProgress> {
    try {
      const raw = localStorage.getItem(COURSES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  getProgress(courseId: string): CourseProgress {
    const all = this.getAllProgress();
    return (
      all[courseId] || {
        status: 'pendiente',
        completedLessons: [],
        lastLesson: null,
        pointsAwarded: 0,
        startedAt: null,
        completedAt: null,
      }
    );
  }

  private saveProgress(courseId: string, progress: CourseProgress): void {
    const all = this.getAllProgress();
    all[courseId] = progress;
    localStorage.setItem(COURSES_KEY, JSON.stringify(all));
  }

  getLessonList(courseId: string): string[] {
    return this.lessonsByCourse[courseId] || [];
  }

  startCourse(courseId: string): CourseProgress {
    const progress = this.getProgress(courseId);
    if (progress.status === 'pendiente') {
      progress.status = 'en_progreso';
      progress.startedAt = progress.startedAt || new Date().toISOString();
      const lessons = this.getLessonList(courseId);
      const next = lessons.find((l) => !progress.completedLessons.includes(l));
      progress.lastLesson = progress.lastLesson || next || lessons[0] || null;
      this.saveProgress(courseId, progress);
    }
    return progress;
  }

  isLessonComplete(courseId: string, lessonTitle: string): boolean {
    return this.getProgress(courseId).completedLessons.includes(lessonTitle);
  }

  getNextLesson(courseId: string, currentLesson: string | null): string | null {
    const lessons = this.getLessonList(courseId);
    if (lessons.length === 0) return null;
    if (!currentLesson) {
      return lessons.find((l) => !this.isLessonComplete(courseId, l)) || null;
    }
    const idx = lessons.indexOf(currentLesson);
    if (idx === -1) return lessons.find((l) => !this.isLessonComplete(courseId, l)) || null;
    const next = lessons.find((l, i) => i > idx && !this.isLessonComplete(courseId, l));
    return next || null;
  }

  getFirstIncompleteLesson(courseId: string): string | null {
    const lessons = this.getLessonList(courseId);
    return lessons.find((l) => !this.isLessonComplete(courseId, l)) || null;
  }

  completeLesson(
    courseId: string,
    lessonTitle: string,
    coursePoints: number
  ): CompleteLessonResult {
    const progress = this.getProgress(courseId);
    const lessons = this.getLessonList(courseId);

    const newlyCompleted = !progress.completedLessons.includes(lessonTitle);
    if (newlyCompleted) {
      progress.completedLessons.push(lessonTitle);
    }
    progress.lastLesson = lessonTitle;
    if (progress.status === 'pendiente') {
      progress.status = 'en_progreso';
      progress.startedAt = progress.startedAt || new Date().toISOString();
    }

    const allDone = lessons.length > 0 && lessons.every((l) => progress.completedLessons.includes(l));
    let courseCompleted = false;
    let pointsEarned = 0;

    if (allDone && progress.status !== 'completado') {
      progress.status = 'completado';
      progress.completedAt = new Date().toISOString();
      progress.pointsAwarded = coursePoints;
      pointsEarned = coursePoints;
      courseCompleted = true;
      this.addLearningPoints(coursePoints);
    }

    this.saveProgress(courseId, progress);

    return {
      newlyCompleted,
      courseCompleted,
      pointsEarned,
      progressPct: this.calculateProgressPct(courseId),
    };
  }

  markLessonComplete(courseId: string, lessonTitle: string): void {
    const progress = this.getProgress(courseId);
    if (!progress.completedLessons.includes(lessonTitle)) {
      progress.completedLessons.push(lessonTitle);
      if (progress.status === 'pendiente') {
        progress.status = 'en_progreso';
        progress.startedAt = progress.startedAt || new Date().toISOString();
      }
      this.saveProgress(courseId, progress);
    }
  }

  resetCourse(courseId: string): void {
    const progress: CourseProgress = {
      status: 'pendiente',
      completedLessons: [],
      lastLesson: null,
      pointsAwarded: 0,
      startedAt: null,
      completedAt: null,
    };
    this.saveProgress(courseId, progress);
  }

  calculateProgressPct(courseId: string): number {
    const lessons = this.getLessonList(courseId);
    if (lessons.length === 0) return 0;
    const done = this.getProgress(courseId).completedLessons.length;
    return Math.round((done / lessons.length) * 100);
  }

  calculateCompletedModules(courseId: string, modules: { name: string; lessons: string[] }[]): number {
    const completed = this.getProgress(courseId).completedLessons;
    return modules.filter((m) => m.lessons.every((l) => completed.includes(l))).length;
  }

  getEarnedPoints(): number {
    try {
      return Number(localStorage.getItem(LEARNING_POINTS_KEY) || 0);
    } catch {
      return 0;
    }
  }

  addLearningPoints(points: number): void {
    localStorage.setItem(LEARNING_POINTS_KEY, String(this.getEarnedPoints() + points));
  }

  getCompletedCourseIds(): string[] {
    const all = this.getAllProgress();
    return Object.keys(all).filter((id) => all[id].status === 'completado');
  }

  getInProgressCourseIds(): string[] {
    const all = this.getAllProgress();
    return Object.keys(all).filter((id) => all[id].status === 'en_progreso');
  }

  // ─── Quiz ─────────────────────────────────────────────────────
  getQuizStats(): QuizStats {
    try {
      const raw = localStorage.getItem(QUIZ_STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return {
      attempts: 0,
      perfectQuizzes: 0,
      bestScore: 0,
      totalPointsEarned: 0,
      lastDate: null,
    };
  }

  recordQuizResult(totalQuestions: number, correctAnswers: number): { earnedPoints: number; newPerfect: boolean } {
    const stats = this.getQuizStats();
    const scorePct = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
    const earnedPoints = scorePct >= 0.6 ? Math.round(correctAnswers * 5) : 0;
    const newPerfect = scorePct === 1;

    stats.attempts += 1;
    stats.bestScore = Math.max(stats.bestScore, Math.round(scorePct * 100));
    if (newPerfect) stats.perfectQuizzes += 1;
    stats.totalPointsEarned += earnedPoints;
    stats.lastDate = new Date().toISOString();

    localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
    if (earnedPoints > 0) this.addLearningPoints(earnedPoints);

    return { earnedPoints, newPerfect };
  }
}

export const coursesService = new CoursesService();
export default coursesService;
