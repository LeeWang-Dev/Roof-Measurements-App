import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import es from "javascript-time-ago/locale/es";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(es);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
