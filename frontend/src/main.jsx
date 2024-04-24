import ReactDOM from "react-dom/client";
import "./output.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import App from "./components/app/App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
