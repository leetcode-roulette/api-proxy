export interface LeetcodeProblem {
  stat: Stat;
  status: string | null;
  difficulty: Difficulty;
  paid_only: boolean;
  is_favor: boolean;
  frequency: number;
  progress: number;
}

interface Difficulty {
  level: number;
}

interface Stat {
  question_id: number;
  question__article__live: boolean;
  question__article__slug: string;
  question__article__has_video_solution: boolean;
  question__title: string;
  question__title_slug: string;
  question__hide: boolean;
  total_acs: number;
  total_submitted: number;
  frontend_question_id: number;
  is_new_question: boolean;
}