import axios from "axios";
import routes from "../../routes/routes";
import { endpoints } from "./endpoints";


export const TOKEN_STORAGE_KEY = "token";
export const REFRESH_STORAGE_TOKEN_KEY = "refreshToken";

let API_HOST = "";

// eslint-disable-next-line no-restricted-globals

switch (location.host) {
  case "127.0.0.1:5173":
    API_HOST = "http://localhost:3000";
    break;
  case "geriatramarinalobo.com.br":
  case "www.geriatramarinalobo.com.br":
    API_HOST = "https://api.geriatramarinalobo.com.br";
    break;
}

export const API_BASE_URL = API_HOST;
// export const API_BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem(TOKEN_STORAGE_KEY)

export const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const access_token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (error.response.status === 401 && access_token && error.config.url !== endpoints.REFRESH_TOKEN) {
      const request = await refreshToken();
      if (!request) {
        localStorage.clear();
        window.location.href = routes.LOGIN;
        return Promise.reject(error);
      }
      error.config.headers.Authorization = `Bearer ${request?.access_token}`;
      const originalRequest = error.config;
      originalRequest.retry = true;
      return Promise.resolve(Api(originalRequest));;
    }
    return Promise.reject(error);;
  }
);

export async function refreshToken() {
  try {
    const request = await Api.post(endpoints.REFRESH_TOKEN, {
      refreshToken: localStorage.getItem(REFRESH_STORAGE_TOKEN_KEY),
    });
    const { access_token, refresh_token } = request.data;
    Api.defaults.headers.Authorization = `Bearer ${access_token}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(REFRESH_STORAGE_TOKEN_KEY, refresh_token);
    return request.data;
  } catch (error: any) {
    return null;
  }
}
