import axios from "axios";
import routes from "../routes/routes";

export const TOKEN_STORAGE_KEY = "token";
export const REFRESH_STORAGE_TOKEN_KEY = "refreshToken";

export const API_BASE_URL = 'https://ec2-15-228-60-83.sa-east-1.compute.amazonaws.com:3000';
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
    if (error.response.status === 401 && access_token && error.config.url !== apiEndpoints.REFRESH_TOKEN) {
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

export const apiEndpoints = {
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh-token',
  REGISTER: '/register',
  PROFILE: '/profile',
  PATIENTS: '/patients',
  PATIENT: '/patient/:id',
  ATTRIBUTE: '/attribute/:name',
  ATTRIBUTES: '/attributes',
  APPOINTMENT: '/appointment/:id',
  APPOINTMENTS: '/appointments',
}

export async function refreshToken() {
  try {
    const request = await Api.post(apiEndpoints.REFRESH_TOKEN, {
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
