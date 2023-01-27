import { Pagination } from "../../helpers/Pagination";
import { Api, apiEndpoints } from "../../services/api";
import { IAttribute } from "./types";

export async function listAttibutesFn() {
  const res = await Api.get<Pagination<IAttribute>>(apiEndpoints.ATTRIBUTES)
  return res.data;
}

export async function createAttributeFn(attribute: IAttribute) {
  const res = await Api.post<IAttribute>(apiEndpoints.ATTRIBUTE.replace("/:name", ""), attribute)
  return res.data;
}

export async function deleteAttributeFn(name: string) {
  const res = await Api.delete<IAttribute>(apiEndpoints.ATTRIBUTE.replace(":name", name))
  return res.data;
}