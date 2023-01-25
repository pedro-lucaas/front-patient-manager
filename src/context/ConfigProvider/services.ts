import { Pagination } from "../../helpers/Pagination";
import { Api, apiEndpoints } from "../../services/api";
import { IAttribute } from "./types";

export async function listAttibutesFn() {
  const res = await Api.get<Pagination<IAttribute>>(apiEndpoints.ATTRIBUTES)
  return res.data;
}

export async function createAttributeFn(attribute: IAttribute) {
  try {
    const res = await Api.post<IAttribute>(apiEndpoints.ATTRIBUTE.replace("/:name", ""), attribute)
    return res.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function deleteAttributeFn(name: string) {
  try {
    const res = await Api.delete<IAttribute>(apiEndpoints.ATTRIBUTE.replace(":name", name))
    return res.data;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
}