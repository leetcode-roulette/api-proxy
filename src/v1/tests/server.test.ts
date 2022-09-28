import { app } from "../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { IProblem, ITag, Problems, Tags } from "../models";
import { ProblemData } from "../services";
import { TagData } from "../services/interfaces";

beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/JestDBV1", {}, () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  })
});

test("GET /v1/problems", async () => {
  const problem : IProblem = await Problems.create({
    problemId: 1,
    frontEndId: 1,
    title: "Test problem",
    titleSlug: "test_problem",
    difficulty: 1,
    numAccepted: 1,
    numSubmitted: 1,
  });

  await supertest(app).get("/v1/problems")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.questions)).toBeTruthy();
      expect(response.body.questions.length).toEqual(1);

      const question : ProblemData = response.body.questions[0];
      expect(question.difficulty).toBe(problem.difficulty);
      expect(question.id).toBe(problem.problemId);
      expect(question.title).toBe(problem.title);
      expect(question.title_slug).toBe(problem.titleSlug);
      expect(question.is_premium).toBe(problem.isPremium);
      expect(question.num_submitted).toBe(problem.numSubmitted);
      expect(question.num_accepted).toBe(problem.numAccepted);
    });
});

test("GET /v1/problems/:problemId", async () => {
  const problem : IProblem = await Problems.create({
    problemId: 1,
    frontEndId: 1,
    title: "Test problem",
    titleSlug: "test_problem",
    difficulty: 1,
    numAccepted: 1,
    numSubmitted: 1,
  });

  await supertest(app).get("/v1/problems/1")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.questions)).toBeFalsy();

      const question : ProblemData = response.body.question;
      expect(question.difficulty).toBe(problem.difficulty);
      expect(question.id).toBe(problem.problemId);
      expect(question.title).toBe(problem.title);
      expect(question.title_slug).toBe(problem.titleSlug);
      expect(question.is_premium).toBe(problem.isPremium);
      expect(question.num_submitted).toBe(problem.numSubmitted);
      expect(question.num_accepted).toBe(problem.numAccepted);
    });

    await supertest(app).get("/v1/problems/2")
      .expect(404)
});

test("GET /v1/tags", async () => {
  const tag : ITag = await Tags.create({
    tagId: 1,
    name: "Heap",
    numberOfProblems: 1
  });

  await supertest(app).get("/v1/tags")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.tags)).toBeTruthy();
      expect(response.body.tags.length).toEqual(1);

      const t : TagData = response.body.tags[0];
      expect(t.id).toBe(tag.tagId);
      expect(t.name).toBe(tag.name);
      expect(t.number_of_problems).toBe(tag.numberOfProblems);
    });
});
