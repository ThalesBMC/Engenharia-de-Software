import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { RankingContextProvider } from "./context/RankingContext";
ReactDOM.render(
  <React.StrictMode>
    <RankingContextProvider>
      <App />
    </RankingContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
