import { app } from "../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { IProblem, Problems } from "../models/problems";
import { ProblemData } from "../services";

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
    });
});

test("GET /v1/problems/:problemId", async () => {
  const problem : IProblem = await Problems.create({
    problemId: 1,
    frontEndId: 1,
    title: "Test problem",
    titleSlug: "test_problem",
    difficulty: 1,
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
    });

    await supertest(app).get("/v1/problems/2")
      .expect(404)
})