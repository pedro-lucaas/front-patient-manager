import React from "react";
import { AuthContext } from "./index";
import { IAuthContext } from "./types";

export const useAuth = (): IAuthContext => {
  const context = React.useContext(AuthContext);

  return context;
}