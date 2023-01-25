import { toast } from "react-toastify";
import { Api, apiEndpoints, REFRESH_STORAGE_TOKEN_KEY, TOKEN_STORAGE_KEY } from "../../services/api";

export async function loginRequest(email: string, password: string) {
  try {
    const request = await Api.post(apiEndpoints.LOGIN, {
      email,
      password,
    });
    const { access_token, refresh_token } = request.data;
    Api.defaults.headers.Authorization = `Bearer ${access_token}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(REFRESH_STORAGE_TOKEN_KEY, refresh_token);

    const profile = await getProfileRequest();

    return { ...profile, token: access_token };
  } catch (error: any) {
    toast.error(error.response.data.message);
    return null;
  }
}

export async function getProfileRequest() {
  try {
    const request = await Api.get(apiEndpoints.PROFILE);
    return request.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return null;
  }
}

