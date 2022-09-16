import { ProblemExtractor } from '../problem-extractor';
import { LeetcodeProblem } from '../problem-extractor/interfaces';
import { axiosClient } from '../problem-extractor/axios-client';
import { AxiosResponse } from 'axios';

test('ProblemExtractor problems are not null', async () => {
  const problems : LeetcodeProblem[] | null = await ProblemExtractor.problems;
  expect(problems).not.toBeNull();
});

test('Fetches all problems from Leetcode', async () => {
  const problems : LeetcodeProblem[] | null = await ProblemExtractor.problems;
  const numProblems : number = await getNumberOfLeetcodeProblems();
  expect(problems).toHaveLength(numProblems);
});

const getNumberOfLeetcodeProblems = async () : Promise<number> => {
  const data : AxiosResponse = await axiosClient.get("/api/problems/all");
  return data.data.num_total;
}