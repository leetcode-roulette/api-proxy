import { MongooseQuery, Difficulty, Search, ProblemId, ExpressQuery } from ".";
import { IProblemTag, ITag, ProblemTags, Tags } from "../models";

export class Query {
  private mongooseQuery: MongooseQuery = {};
  private sortString: string = "";
  private query: ExpressQuery;
  
  constructor(query: ExpressQuery) {
    this.query = query;
  }

  public async initializeMongooseQuery(): Promise<void> {
    this.getDifficulties(this.query.difficulty);
    this.getPremiumStatus(this.query.premium);
    this.getSearch(this.query.q);
    await this.getProblemsWithTags(this.query.tags);
  }

  public async getQuery(): Promise<MongooseQuery> {
    if (Object.keys(this.mongooseQuery).length === 0) {
      await this.initializeMongooseQuery();
    }

    return this.mongooseQuery;
  }

  public getSort(): string {
    if (this.sortString === "") {
      this.getSortString();
    }

    return this.sortString;
  }

  private getSortString(): void {
    let sortString: string | null = this.query.sort;
    const sortStrings : Set<string> = new Set([
      "difficulty",
      "title",
      "problemId"
    ]);

    if (sortString === null || !sortStrings.has(sortString)) {
      sortString = "problemId";
    }

    this.sortString = sortString;
  }

  private getDifficulties(difficultiesQuery: string): void {
    const difficulty: Difficulty = {
      "$in": []
    };

    if (!difficultiesQuery) {
      return;
    }

    difficultiesQuery.split(",").forEach(difficultyQuery => {
      if (this.isValidDifficulty(difficultiesQuery)) {
        difficulty.$in.push(this.getDifficulty(difficultiesQuery));
      }
    });

    this.mongooseQuery.difficulty = difficulty;
  }

  private isValidDifficulty(difficulty): boolean {
    const d = difficulty.toLowerCase();
    const valid = ["1", "2", "3", "easy", "medium", "hard"];

    for (let i = 0; i < valid.length; i++) {
      if (d === valid[i]) return true;
    }

    return false;
  }

  private getDifficulty(difficulty: string): number {
    switch(difficulty.toLowerCase()) {
      case("easy"):
        return 1;
      case("medium"):
        return 2;
      case("hard"):
        return 3;
    }

    return parseInt(difficulty);
  }

  private getPremiumStatus(premium: string | undefined): void {

    if (premium && premium.toLowerCase() === "false") {
      this.mongooseQuery.isPremium = false;
    }
  }

  private getSearch(search: string): void {
    if (!search) {
      return;
    }

    this.mongooseQuery.title = {"$regex": search.split(',').join('|'), "$options": "i"}
  }

  private async getProblemsWithTags(tags: string | undefined): Promise<void> {
    if (!tags) {
      return;
    }

    try {
      let problemIds: number[] = await this.getProblemIds(tags.split(","));
      this.mongooseQuery.problemId = { "$in": problemIds };
    } catch(e) {
      throw new Error("Exception caught getting problemIds " + e);
    }
  }

  private async getProblemIds(tags: string[]): Promise<number[]> {
    const problemIds : number[] = [];

    try {
      const problemTags: IProblemTag[] = await ProblemTags.find({ tagSlug: { "$in": tags }});
      problemTags.forEach( problemTag => {
        problemIds.push(problemTag.problemId);
      });
    } catch(e) {
      throw new Error("Exception caught executing processes " + e);
    }
    
    return problemIds;
  }
}
