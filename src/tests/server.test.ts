import { app } from "../app";
import supertest from "supertest";
import { Database } from "../v1/db/db.config";

beforeEach((done) => {
  Database.connect().then(() => done());
});

afterEach((done) => {
  Database.disconnect().then(() => done());
})

test("GET /v1/problems", async () => {  
  await supertest(app).get("/v1/problems?limit=10")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.questions)).toBeTruthy();
      expect(response.body.questions.length).toEqual(10);
    });
});
