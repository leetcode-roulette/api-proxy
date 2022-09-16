import axios, { AxiosInstance } from "axios";

export const axiosClient : AxiosInstance = axios.create({
  baseURL: "https://leetcode.com/"
});