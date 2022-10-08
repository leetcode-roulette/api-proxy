import { MongooseQuery, Difficulty, Search, ProblemId, ExpressQuery } from ".";
import { logger } from "../../logger";
import { IProblemTag, ITag, ProblemTags, Tags } from "../models";

export class Query {
  private mongooseQuery: MongooseQuery = {};
  private sortString: string = "";
  
  constructor(query: ExpressQuery) {
    this.initializeMongooseQuery(query);
    this.getSortString(query.sort);
  }

  public initializeMongooseQuery(query: ExpressQuery) {
    this.getDifficulties(query.difficulty);
    this.getPremiumStatus(query.premium);
    this.getSearch(query.q);
    this.getProblemsWithTags(query.tags).catch(e => logger.error(e));
  }

  public get query(): MongooseQuery {
    return this.mongooseQuery;
  }

  public get sort(): string {
    return this.sortString;
  }

  private getSortString(sortString: string | null): void {
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
    this.mongooseQuery.isPremium = !(premium && premium.toLowerCase() === "false");
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
      let problemIds: number[] = await this.getProblemIds(tags.split(",")).then(data => data);
      this.mongooseQuery.problemId = await { "$in": problemIds };
    } catch(e) {
      throw new Error("Exception caught getting problemIds " + e);
    }
  }

  private async getProblemIds(tags: string[]): Promise<number[]> {
    const processes : Promise<void>[] = [];
    const problemIds : number[] = [];

    tags.forEach(tag => {
      processes.push(this.appendProblemIdsByTagSlug(tag, problemIds));
    });

    try {
      await Promise.all(processes);
    } catch(e) {
      throw new Error("Exception caught executing processes " + e);
    }
    
    return problemIds;
  }

  private async appendProblemIdsByTagSlug(nameSlug: string, problemIds: number[]): Promise<void> {
    try {
      const tagId = await this.getTagIdBySlug(nameSlug);
      const ids = await this.getProblemIdsByTagId(tagId);
      problemIds.push(...ids);
    } catch(e) {
      throw new Error("Exception caught getting problem Ids: " + e);
    }
  }

  private async getTagIdBySlug(nameSlug: string): Promise<number> {
    try {
      const tag : ITag | null = await Tags.findOne({ nameSlug });

      if (tag === null) {
        throw new Error("Error getting tag by name slug");
      }

      return tag.tagId;
    } catch(e) {
      throw new Error("Exception caught getting tag by slug: " + e);
    }
  }

  private async getProblemIdsByTagId(tagId: number) {
    try {
      const problemIds: number[] = [];
      const problemTags: IProblemTag[] = await ProblemTags.find({ tagId });

      problemTags.forEach( problemTag => {
        problemIds.push(problemTag.problemId);
      });

      return problemIds;
    } catch(e) {
      throw new Error("Exception caught getting problem tag by id");
    }
  }
}
