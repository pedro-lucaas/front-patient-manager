import React from "react";
import { ConfigContext } from "./index";

export const useConfig = () => {
  const context = React.useContext(ConfigContext);

  return context;
}