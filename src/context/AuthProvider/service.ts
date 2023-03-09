import { toast } from "react-toastify";
import { Api, REFRESH_STORAGE_TOKEN_KEY, TOKEN_STORAGE_KEY } from "../../services/api";
import { endpoints } from "../../services/api/endpoints";

export async function loginRequest(email: string, password: string) {
  try {
    const request = await Api.post(endpoints.LOGIN, {
      email,
      password,
    });
    const { access_token, refresh_token } = request.data;
    Api.defaults.headers.Authorization = `Bearer ${access_token}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(REFRESH_STORAGE_TOKEN_KEY, refresh_token);

    return { token: access_token };
  } catch (error: any) {
    toast.error(error.response.data.message);
    return null;
  }
}

export async function getProfileRequest() {
  try {
    const response = await Api.get(endpoints.PROFILE);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return null;
  }
}

export async function updateProfileRequest(data: any) {
  try {
    const response = await Api.put(endpoints.PROFILE, data);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return null;
  }
}

