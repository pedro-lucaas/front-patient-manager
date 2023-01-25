import React from "react";
import { AuthContext } from "./index";

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  return context;
}