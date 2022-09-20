export interface ResponseJson {
  message: string;
  question?: ProblemData;
  questions?: ProblemData[];
  paging?: PagingData;
}

export interface ProblemData {
  title: string;
  title_slug: string;
  id: Number;
  difficulty: Number;
  is_premium: boolean;
};

export interface PagingData {
  total: number;
  page: number;
  pages: number;
};

export interface Query {
  limit: string;
  offset: string;
  difficulty: string;
  premium: string;
};

export interface Params {
  problemId: string
};

export interface MongooseQuery {
  difficulty?: Difficulty;
  isPremium?: boolean;
}

interface Difficulty {
  "$in": number[];
}