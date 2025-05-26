import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const AxiosInstanceBlog = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BLOG,
});
