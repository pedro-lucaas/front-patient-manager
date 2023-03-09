import { Api } from "../../services/api";
import { endpoints } from "../../services/api/endpoints";
import { IAttribute } from "./types";

export async function createAttributeFn(patientId: string, attribute: IAttribute) {
  const res = await Api.post<IAttribute>(endpoints.ATTRIBUTE.CREATE.replace(":patientId", patientId), attribute)
  return res.data;
}

export async function deleteAttributeFn(patientId: string, name: string) {
  const res = await Api.delete(endpoints.ATTRIBUTE.DELETE.replace(":patientId", patientId).replace(":name", name))
  return res.data;
}