import axios from "axios";
import { DefaultApi } from "./api";
import { Configuration } from "./configuration";

export function useApiClient() {

  const basePath = "/apis/default-api";
  const authHeaders: Record<string, string> = {};
  const axiosInstance = axios.create({
    headers: authHeaders,
  });
  const config = new Configuration({ basePath });

  return new DefaultApi(config, basePath, axiosInstance);
}
